import styles from './SelectTypeAnnouncements.module.css';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export function SelectTypeAnnouncements() {
    const router = useRouter();
    const path = usePathname();
    const [selectedBtn, setSelectedBtn] = useState<'house' | 'neighbor'>(
        path === '/users_announcements' ? 'neighbor' : 'house'
    );
    function handlerClickNeighbor() {
        setSelectedBtn('neighbor');

        router.push('/users_announcements');
    }

    function handlerClickHouse() {
        setSelectedBtn('house');

        router.push('/houses_announcements');
    }

    return (
        <div className={styles.container}>
            {/*<header>Я ищу:</header>*/}
            <div className={styles.btns}>
                <button
                    onClick={handlerClickHouse}
                    className={
                        selectedBtn === 'house' ? styles.selectedBtn : ''
                    }
                >
                    Объявления о жилье
                </button>
                <button
                    onClick={handlerClickNeighbor}
                    className={
                        selectedBtn === 'neighbor' ? styles.selectedBtn : ''
                    }
                >
                    Анкеты соседей
                </button>
            </div>
        </div>
    );
}
