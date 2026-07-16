'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { queryCache, serializeQueryKey } from '@/lib/cache/queryCache';
import type { QueryKey, QueryOptions, QueryState } from '@/types/query';

const DEFAULT_RETRY = 3;
const DEFAULT_RETRY_DELAY = 1_000;

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number,
  baseDelay: number,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, baseDelay * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError;
}

interface QueryStateInternal<T> {
  data: T | undefined;
  error: Error | null;
  isFetching: boolean;
}

function doFetch<T>(
  keyString: string,
  fetcher: () => Promise<T>,
  retry: number,
  retryDelay: number,
  staleTime: number,
  forceFetch: boolean,
  signal: AbortSignal,
  onResult: (data: T) => void,
  onError: (error: Error) => void,
): void {
  const cached = queryCache.get<T>(keyString);
  const isFresh = !queryCache.isStale(keyString, staleTime);

  if (!forceFetch && cached !== undefined && isFresh) {
    onResult(cached);
    return;
  }

  const inFlight = queryCache.getInFlight<T>(keyString);

  const run = async () => {
    try {
      const data = await (inFlight ?? retryWithBackoff(fetcher, retry, retryDelay));

      if (!inFlight) {
        queryCache.clearInFlight(keyString);
      }

      if (!signal.aborted) {
        queryCache.set(keyString, data);
        onResult(data);
      }
    } catch (error) {
      queryCache.clearInFlight(keyString);
      if (!signal.aborted) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    }
  };

  if (!inFlight) {
    const promise = retryWithBackoff(fetcher, retry, retryDelay);
    queryCache.setInFlight(keyString, promise);
    promise.then(
      () => queryCache.clearInFlight(keyString),
      () => queryCache.clearInFlight(keyString),
    );
  }

  run();
}

export function useQuery<T>(
  queryKey: QueryKey,
  fetcher: () => Promise<T>,
  options: QueryOptions<T> = {},
): QueryState<T> {
  const {
    enabled = true,
    staleTime = 0,
    refetchOnWindowFocus = true,
    refetchOnMount = true,
    refetchInterval,
    retry = DEFAULT_RETRY,
    retryDelay = DEFAULT_RETRY_DELAY,
    onSuccess,
    onError,
  } = options;

  const keyString = serializeQueryKey(queryKey);
  const fetcherRef = useRef(fetcher);
  const optionsRef = useRef({ onSuccess, onError });
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    fetcherRef.current = fetcher;
    optionsRef.current = { onSuccess, onError };
  });

  const [state, setState] = useState<QueryStateInternal<T>>(() => ({
    data: queryCache.get<T>(keyString),
    error: null,
    isFetching: false,
  }));

  const runFetch = useCallback(
    (forceFetch: boolean) => {
      if (!enabled) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState((prev) => ({ ...prev, error: null, isFetching: true }));

      doFetch(
        keyString,
        () => fetcherRef.current(),
        retry,
        retryDelay,
        staleTime,
        forceFetch,
        controller.signal,
        (data) => {
          if (!controller.signal.aborted) {
            setState({ data, error: null, isFetching: false });
            optionsRef.current.onSuccess?.(data);
          }
        },
        (error) => {
          if (!controller.signal.aborted) {
            setState((prev) => ({ ...prev, error, isFetching: false }));
            optionsRef.current.onError?.(error);
          }
        },
      );
    },
    [keyString, enabled, staleTime, retry, retryDelay],
  );

  useEffect(() => {
    if (!enabled || !refetchOnMount) return;

    if (!mountedRef.current) {
      mountedRef.current = true;
      runFetch(false);
    }

    return () => {
      abortRef.current?.abort();
    };
  }, [runFetch, enabled, refetchOnMount]);

  useEffect(() => {
    if (!enabled || !refetchOnWindowFocus) return;

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        runFetch(true);
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [runFetch, enabled, refetchOnWindowFocus]);

  useEffect(() => {
    if (!enabled || !refetchInterval || refetchInterval <= 0) return;

    const id = setInterval(() => runFetch(true), refetchInterval);
    return () => clearInterval(id);
  }, [runFetch, enabled, refetchInterval]);

  const hasData = state.data !== undefined;
  const isLoading = enabled && !hasData && state.isFetching;
  const isFetching = state.isFetching;

  return {
    data: state.data,
    error: state.error,
    isLoading,
    isFetching,
    isSuccess: hasData && state.error === null,
    isError: state.error !== null,
    refetch: useCallback(async () => { runFetch(true); }, [runFetch]),
  };
}
