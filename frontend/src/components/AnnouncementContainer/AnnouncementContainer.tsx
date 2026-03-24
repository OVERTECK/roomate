'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader/Loader';
import MyError from '@/components/Error/MyError';

interface Props<T> {
    queryKey: string;
    queryFn: (city: string) => Promise<T[]>;
    ListComponent: React.ComponentType<{ announcements: T[] }>;
    city: string;
    filterPrice: { min: number; max: number };
    sort: string | null;
}

function AnnouncementContainer<
    T extends { price: number; updatedAt: string | Date },
>({ queryKey, queryFn, ListComponent, city, filterPrice, sort }: Props<T>) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const {
        data = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: [queryKey, city],
        queryFn: async () => await queryFn(city),
    });

    const announcements = useMemo(() => {
        let result = [...data];

        if (filterPrice.min)
            result = result.filter((a: any) => a.price >= filterPrice.min);

        if (filterPrice.max)
            result = result.filter((a: any) => a.price <= filterPrice.max);

        if (sort) {
            const [field, order] = sort.split('.');

            result.sort((a: any, b: any) => {
                let r = 0;

                if (field === 'price') r = a.price - b.price;

                if (field === 'updatedAt')
                    r =
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime();

                return order === 'DESC' ? -r : r;
            });
        }

        return result;
    }, [data, filterPrice, sort]);

    useEffect(() => {
        const currentCity = searchParams.get('city');

        if (city !== currentCity) {
            const params = new URLSearchParams();

            params.set('city', city);

            router.replace(`${pathname}?${params.toString()}`);
        }
    }, [city, searchParams]);

    if (isLoading) return <Loader />;
    if (error) return <MyError error={String(error)} />;

    return <ListComponent announcements={announcements} />;
}

export default AnnouncementContainer;
