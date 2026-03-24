'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from '@/app/house_announcement/[id]/styles.module.css';
import { PriceAnnouncement } from '@/components/PriceAnnouncement/PriceAnnouncement';
import ProfileWithMessage from '@/components/ProfileWithMessage/ProfileWithMessage';
import { isoToDateTime } from '@/utils/formatDate';
import MyError from '@/components/Error/MyError';
import { UUID } from 'node:crypto';
import { useAuth } from '@/hooks/useAuth';
import { UserAnnouncementService } from '@/services/UserAnnouncementService';
import { IUserAnnouncement } from '@/models/IUserAnnouncement';
import ImageUser from '@/components/ImageUser/ImageUser';
import Image from 'next/image';
import { userAnnouncementService } from '@/services';

const Page = () => {
    const params = useParams<{ id: string }>();
    const announcementId = params.id as UUID;
    const router = useRouter();
    const { isAuth, isAuthLoading, user } = useAuth();
    const [announcement, setAnnouncement] = useState<IUserAnnouncement | null>(
        null
    );

    useEffect(() => {
        if (!isAuthLoading && !isAuth) {
            router.push('/login');
        }

        async function getAnnouncement() {
            const responseAnnouncement =
                await userAnnouncementService.getById(announcementId);

            setAnnouncement(responseAnnouncement);
        }

        getAnnouncement();
    }, [announcementId, isAuth, router]);

    if (!announcement) {
        return <MyError error="Объявление не найдено" />;
    }

    return (
        <article className={styles.container}>
            <header className={styles.header}>
                <Image
                    width={200}
                    height={200}
                    loading="eager"
                    src={announcement.mainPhotoUrl}
                    alt="изображение пользователя"
                    className="rounded-[50%] w-[200px] h-[200px] object-cover"
                />
                <h2>
                    {announcement.surname} {announcement.name}
                </h2>
                <PriceAnnouncement price={announcement?.price} />
            </header>
            {user?.id !== announcement.createdUserId && (
                <ProfileWithMessage
                    profileUser={announcement.createdUser}
                    showAvatarAndName={false}
                />
            )}
            <section className="p-5 bg-[#f9f9f9] rounded-[8px] border-l-4 border-[var(--main-color)] mb-5">
                <h2>Описание:</h2>
                <p className="w-full overflow-visible break-words whitespace-normal">
                    {announcement?.description || 'Не указано'}
                </p>
            </section>
            <dl className={styles.details}>
                <div className={styles.detailItem}>
                    <dt>Город:</dt>
                    <dd>{announcement?.city}</dd>
                </div>
                <div className={styles.detailItem}>
                    <dt>Объявление создано:</dt>
                    <dd>{isoToDateTime(announcement?.createdAt.toString())}</dd>
                </div>
            </dl>
        </article>
    );
};

export default Page;
