'use client';

import React, { useEffect, useState } from 'react';
import HouseAnnouncementService from '@/services/HouseAnnouncementService';
import MyError from '@/components/Error/MyError';
import styles from './page.module.css';
import { useParams } from 'next/navigation';
import { UUID } from 'node:crypto';
import { IUserEntity } from '@/models/IUserEntity';
import { UserAnnouncementService } from '@/services/UserAnnouncementService';
import { IUserAnnouncement } from '@/models/IUserAnnouncement';
import UsersAndHouseAnnouncementsList from '@/components/UsersAndHouseAnnouncementsList/UsersAndHouseAnnouncementsList';
import { AnnouncementRequest } from '@/DTO/request/AnnouncementRequest';
import { houseAnnouncementService, userAnnouncementService, userService } from '@/services';

const Page = () => {
    const [houseAnnouncements, setHouseAnnouncements] = useState<
        AnnouncementRequest[]
    >([]);
    const [userAnnouncements, setUserAnnouncements] = useState<
        IUserAnnouncement[]
    >([]);
    const params = useParams<{ id: UUID }>();
    const idUserPage = params.id;
    const [fetchingUser, setFetchingUser] = useState<IUserEntity | null>(null);

    useEffect(() => {
        async function fetchAnnouncements() {
            try {
                const responseAnnouncements =
                    await houseAnnouncementService.getByUserId(idUserPage);

                setHouseAnnouncements(responseAnnouncements);
            } catch (error) {
                console.error(error);
            }
        }

        async function fetchUser() {
            try {
                const responseUser = await userService.getById(idUserPage);

                setFetchingUser(responseUser);
            } catch (error) {
                console.error(error);
            }
        }

        async function fetchUserAnnouncements() {
            try {
                const responseUserAnnouncements =
                    await userAnnouncementService.getByUserId(idUserPage);

                setUserAnnouncements(responseUserAnnouncements);
            } catch (error) {
                console.error(error);
            }
        }

        fetchAnnouncements();
        fetchUser();
        fetchUserAnnouncements();
    }, [idUserPage]);

    if (!fetchingUser) {
        return <MyError error="Пользователь не найден" />;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                Объявления пользователя {fetchingUser?.surname}{' '}
                {fetchingUser?.name}
            </header>
            <div>
                <UsersAndHouseAnnouncementsList
                    userAnnouncements={userAnnouncements}
                    setUserAnnouncements={setUserAnnouncements}
                    houseAnnouncements={houseAnnouncements}
                    setHouseAnnouncements={setHouseAnnouncements}
                />
            </div>
        </div>
    );
};

export default Page;
