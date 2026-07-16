'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { MutationOptions, MutationState } from '@/types/query';

export function useMutation<TData, TVariables = void>(
  mutator: (variables: TVariables) => Promise<TData>,
  options: MutationOptions<TData, TVariables> = {},
): MutationState<TData, TVariables> {
  const mutatorRef = useRef(mutator);
  const optionsRef = useRef(options);
  const abortRef = useRef<AbortController | null>(null);
  const rollbackRef = useRef<(() => void) | void>(undefined);

  useEffect(() => {
    mutatorRef.current = mutator;
    optionsRef.current = options;
  });

  const [state, setState] = useState<{
    data: TData | undefined;
    error: Error | null;
    isLoading: boolean;
  }>({
    data: undefined,
    error: null,
    isLoading: false,
  });

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const opts = optionsRef.current;

      if (opts.onMutate) {
        rollbackRef.current = await opts.onMutate(variables);
      }

      setState({ data: undefined, error: null, isLoading: true });

      try {
        const data = await mutatorRef.current(variables);

        if (!controller.signal.aborted) {
          setState({ data, error: null, isLoading: false });
          opts.onSuccess?.(data, variables);
          opts.onSettled?.(data, null, variables);
        }

        return data;
      } catch (error) {
        rollbackRef.current?.();
        const err = error instanceof Error ? error : new Error(String(error));

        if (!controller.signal.aborted) {
          setState({ data: undefined, error: err, isLoading: false });
          opts.onError?.(err, variables);
          opts.onSettled?.(undefined, err, variables);
        }

        throw err;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({ data: undefined, error: null, isLoading: false });
  }, []);

  return {
    data: state.data,
    error: state.error,
    isLoading: state.isLoading,
    isSuccess: !state.isLoading && state.error === null && state.data !== undefined,
    isError: state.error !== null,
    mutate,
    reset,
  };
}
