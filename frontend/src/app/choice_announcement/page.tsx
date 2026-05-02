'use client';

import { useEffect } from 'react';
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ChoiceAnnouncement() {
    const router = useRouter();
    const { user, isAuth, isAuthLoading } = useAuth();

    useEffect(() => {
        if (!isAuthLoading) {
            if (!isAuth || user === null) {
                router.push('/login');
            }
        }
    }, [isAuthLoading, isAuth, user, router]);

    return (
        <div className={styles.page}>
            <div>
                <h1 className={styles.title}>Создать объявление:</h1>
                <div className={styles.actions_1}>
                    <button
                        className={styles.action_btn}
                        onClick={() =>
                            router.push('/create/house_announcement')
                        }
                    >
                        Жилья
                    </button>
                    <button
                        className={styles.action_btn}
                        onClick={() => router.push('/create/user_announcement')}
                    >
                        Анкету соседа
                    </button>
                </div>
            </div>
        </div>
    );
}
