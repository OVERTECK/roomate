import { QueryClient } from '@tanstack/react-query';
import { useState } from 'react';

let client: QueryClient | null = null;

export function useQueryClientProvider() {
    return useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    )[0];
}
