import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import styles from '@/components/Header/Header.module.css';

export function ExitButton({ ...props }) {
    const { logout } = useAuth();

    function handleLogout() {
        logout();
    }

    return (
        <Link
            href={'/login'}
            className={[styles.nav_link, styles.logout].join(' ')}
            {...props}
            onClick={handleLogout}
        >
            Выйти
        </Link>
    );
}
