// FROZEN — DO NOT MODIFY — Phase 3 Complete
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

interface AdvancedSearchOptions<T> {
  data: T[];
  query: string;
  fields: (keyof T)[];
  minQueryLength?: number;
  debounceMs?: number;
}

export function useAdvancedSearch<T>({ data, query, fields, minQueryLength = 0, debounceMs = 300 }: AdvancedSearchOptions<T>): T[] {
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  return useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q || q.length < minQueryLength) return data;
    return data.filter((item) =>
      fields.some((field) => {
        const val = item[field];
        if (typeof val === 'string') {
          const lower = val.toLowerCase();
          return (
            lower.includes(q) ||
            lower.includes(q.replace(/[-\s]/g, '')) ||
            partialMatch(lower, q) ||
            phoneMatch(q, lower)
          );
        }
        return false;
      }),
    );
  }, [data, debouncedQuery, fields, minQueryLength]);
}

function partialMatch(text: string, query: string): boolean {
  const qWords = query.split(/\s+/).filter(Boolean);
  const tWords = text.split(/\s+/).filter(Boolean);
  return qWords.length > 1 && qWords.some((qw) => tWords.some((tw) => tw.startsWith(qw) || qw.startsWith(tw)));
}

function phoneMatch(query: string, text: string): boolean {
  const digits = query.replace(/\D/g, '');
  if (digits.length < 3) return false;
  return text.includes(digits) || text.replace(/[-\s]/g, '').includes(digits);
}

export function useDebouncedSearch() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  return { search, debouncedSearch, setSearch, handleSearchChange };
}
