'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ImagesSlider from '@/components/ImagesSlider/ImagesSlider';
import HouseAnnouncementService from '@/services/HouseAnnouncementService';
import { IHouseAnnouncement } from '@/models/IHouseAnnouncement';
import { isoToDateTime } from '@/utils/formatDate';
import { PriceAnnouncement } from '@/components/PriceAnnouncement/PriceAnnouncement';
import styles from './styles.module.css';
import ProfileWithMessage from '@/components/ProfileWithMessage/ProfileWithMessage';
import MyError from '@/components/Error/MyError';
import { UUID } from 'node:crypto';
import { houseAnnouncementService } from '@/services';

const AnnouncementPage = () => {
    const params = useParams<{ id: UUID }>();
    const announcementId = params.id;
    const router = useRouter();
    const { isAuth, isAuthLoading, user } = useAuth();
    const [announcement, setAnnouncement] = useState<IHouseAnnouncement | null>(
        null
    );

    useEffect(() => {
        async function getAnnouncement() {
            const response =
                await houseAnnouncementService.getByAnnouncementId(
                    announcementId
                );

            setAnnouncement(response);
        }

        getAnnouncement();
    }, [announcementId, isAuthLoading, isAuth, user, router]);

    if (!announcement) {
        return <MyError error="Объявление не найдено" />;
    }

    return (
        <article className={styles.container}>
            <header className={styles.header}>
                <ImagesSlider slides={announcement?.photos || []} />
                <PriceAnnouncement price={announcement?.price} />
            </header>
            {user?.id !== announcement.createdUserId && (
                <ProfileWithMessage
                    showAvatarAndName={true}
                    profileUser={announcement.createdUser}
                />
            )}
            <section className={styles.description}>
                <h2>Описание:</h2>
                <p className="w-full overflow-visible wrap-break-word whitespace-normal">
                    {announcement?.description || 'Не указано'}
                </p>
            </section>
            <div className="flex items-center gap-2 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg mt-4 mb-4">
                <dt className="font-semibold text-[#4a5568] text-[15px]">
                    Адрес:
                </dt>
                <dd className="text-[16px] text-[#2d3748] font-medium m-0 overflow-auto">
                    {announcement.fullAddress}
                </dd>
            </div>
            <div className='flex flex-col gap-1'>
                <dl className={styles.details}>
                    <div className={styles.detailItem}>
                        <dt>Количество комнат:</dt>
                        <dd>{announcement?.countRooms}</dd>
                    </div>
                    <div className={styles.detailItem}>
                        <dt>Количество этажей в здании:</dt>
                        <dd>{announcement?.maxFloor}</dd>
                    </div>
                    <div className={styles.detailItem}>
                        <dt>Этаж:</dt>
                        <dd>{announcement?.floor}</dd>
                    </div>
                    <div className={styles.detailItem}>
                        <dt>Нужное количество соседей:</dt>
                        <dd>
                            {announcement?.requiredNumberNeighbors}
                        </dd>
                    </div>
                    <div className={styles.detailItem}>
                        <dt>Есть гараж:</dt>
                        <dd>{announcement?.hasGarage ? 'Да' : 'Нет'}</dd>
                    </div>
                    <div className={styles.detailItem}>
                        <dt>Есть лифт:</dt>
                        <dd>{announcement?.hasLift ? 'Да' : 'Нет'}</dd>
                    </div>
                    <div className={styles.detailItem}>
                        <dt>Номер дома:</dt>
                        <dd>{announcement?.houseNumber}</dd>
                    </div>
                    <div className={styles.detailItem}>
                        <dt>Год постройки здания:</dt>
                        <dd>{announcement?.createdHouse}</dd>
                    </div>
                    <div className={styles.detailItem}>
                        <dt>Объявление создано:</dt>
                        <dd>
                            {isoToDateTime(announcement?.createdAt?.toString())}
                        </dd>
                    </div>
                </dl>
                <p className='m-3 '>Наличие электроники:</p>
                <dl className='flex flex-col w-95 gap-4'>
                    <div className={styles.detailItem}>
                        <dt>Микроволновка:</dt>
                        <dd>
                            {announcement?.hasMicrowave ? "Есть" : "Нет"}
                        </dd>
                    </div>
                    <div className={styles.detailItem}>
                        <dt>Холодильник:</dt>
                        <dd>
                            {announcement?.hasFridge ? "Есть" : "Нет"}
                        </dd>
                    </div>
                    <div className={styles.detailItem}>
                        <dt>Плита:</dt>
                        <dd>
                            {announcement?.hasStove ? "Есть" : "Нет"}
                        </dd>
                    </div>
                    <div className={styles.detailItem}>
                        <dt>Стиральная машина:</dt>
                        <dd>
                            {announcement?.hasWashingMachine ? "Есть" : "Нет"}
                        </dd>
                    </div>
                </dl>
            </div>
        </article>
    );
};

export default AnnouncementPage;
