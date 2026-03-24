'use client';

import styles from './styles.module.css';
import { useRouter } from 'next/navigation';

export default function ChoiceAnnouncement() {
    const router = useRouter();

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
