'use client';

import { useState, useCallback } from 'react';
import { get, post, put, del } from '@/lib/api';
import { ApiError } from '@/types';
import { AxiosError } from 'axios';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export function useApi<T>(
  url: string,
  method: HttpMethod = 'GET'
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (body?: unknown): Promise<T | null> => {
      setState((s) => ({ ...s, isLoading: true, error: null }));
      try {
        let result: T;
        switch (method) {
          case 'POST':
            result = await post<T>(url, body);
            break;
          case 'PUT':
            result = await put<T>(url, body);
            break;
          case 'DELETE':
            result = await del<T>(url);
            break;
          default:
            result = await get<T>(url, body as Record<string, unknown>);
        }
        setState({ data: result, isLoading: false, error: null });
        return result;
      } catch (err) {
        const axiosErr = err as AxiosError<ApiError>;
        const errorMsg =
          axiosErr.response?.data?.detail ||
          axiosErr.message ||
          'An unexpected error occurred';
        setState((s) => ({ ...s, isLoading: false, error: errorMsg }));
        return null;
      }
    },
    [url, method]
  );

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}
