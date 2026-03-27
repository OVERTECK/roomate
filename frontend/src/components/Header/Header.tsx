'use client';

import styles from './Header.module.css';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { ExitButton } from '@/components/ExitButton/ExitButton';
import Image from 'next/image';
import { MoreVentIcon } from '../icons/MoreVent';
import { LoginIcon } from '../icons/LoginIcon';
import MyButton from '../UI/button/MyButton';

function Header() {
    const { isAuth, logout, user } = useAuth();

    return (
        <header className={styles.header}>
            <nav className={styles.nav_1}>
                <Link href="/" className={styles.nav_main}>
                    roomate
                </Link>
            </nav>
            <nav className={styles.nav_2}>
                {isAuth && (
                    <Link
                        href="/choice_announcement"
                        className="w-10 h-10 bg-[#F2D3AC] flex items-center
                        justify-center cursor-pointer text-black text-3xl rounded-[50%]
                        hover:scale-y-110
                        hover:scale-x-110
                        transition
                        "
                    >
                        +
                    </Link>
                )}
            </nav>
            <nav className={styles.nav_3}>
                <div className={styles.popoverWrapper}>
                    <button className={styles.nav_link} popoverTarget='poper'>
                        <MoreVentIcon />
                    </button>
                    <div popover="auto" id='poper' className={styles.poper}>
                        <Link href="/about">
                            <button className={styles.nav_link}>О сервисе</button>
                        </Link>
                    </div>
                </div>
                {user ? (
                    <div>
                        <Link
                            href={`/profile/${user?.id}`}
                            className={[styles.nav_link, styles.profile].join(
                                ' '
                            )}
                        >
                            <Image
                                className={styles.userImg}
                                loading="eager"
                                height={40}
                                width={40}
                                alt="фотография профиля"
                                src={user?.photoUrl}
                            />
                            <span className={styles.userName}>
                                {user?.surname} {user?.name}
                            </span>
                        </Link>
                        <ExitButton />
                    </div>
                ) : (
                    <Link href="/login" className={styles.nav_link}>
                        <LoginIcon />
                    </Link>
                )}
            </nav>
        </header>
    );
}

export default Header;
