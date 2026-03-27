'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import TextArea from '@/components/TextArea/TextArea';
import styles from './styles.module.css';
import MyInput from '@/components/UI/input/MyInput';
import { useAuth } from '@/hooks/useAuth';
import SelectRussiaCity from '@/components/SelectRussiaCity/SelectRussiaCity';
import MyButton from '@/components/UI/button/MyButton';
import ImageUser from '@/components/ImageUser/ImageUser';
import { UserAnnouncementRequest } from '@/DTO/request/UserAnnouncementRequest';
import { UserAnnouncementService } from '@/services/UserAnnouncementService';
import { useRouter } from 'next/navigation';
import MyError from '@/components/Error/MyError';
import { userAnnouncementService } from '@/services';
import { set } from 'zod';

const Page = () => {
    const { user } = useAuth();
    const [announcementUser, setAnnouncementUser] =
        useState<UserAnnouncementRequest>({
            description: '',
            city: user?.city || '',
            price: "",
            mainPhotoUrl: user?.photoUrl || '/default_user_img.svg',
            name: user?.name || '',
            surname: user?.surname || '',
        });
    const [error, setError] = useState<string>('');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handlerSubmit() {
        setIsLoading(true);
        const response = await userAnnouncementService.add(announcementUser);

        if (response.status !== 200) {
            setError(response.message);

            return;
        }

        setIsLoading(false);

        router.push('/users_announcements');
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                Создание объявления пользователя
            </header>
            <div className={styles.form}>
                <ImageUser
                    urlToImage={announcementUser.mainPhotoUrl}
                    setUrlToImage={(image) => {
                        setAnnouncementUser((prev) => ({
                            ...prev,
                            mainPhotoUrl: image,
                        }))
                    }
                    }
                />
                <TextArea
                    title="Описание:"
                    value={announcementUser.description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setAnnouncementUser({
                            ...announcementUser,
                            description: e.target.value,
                        })
                    }
                />
                <MyInput
                    title="Имя:"
                    value={announcementUser.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setAnnouncementUser({
                            ...announcementUser,
                            name: e.target.value,
                        })
                    }
                />
                <MyInput
                    title="Фамилия:"
                    value={announcementUser.surname}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setAnnouncementUser({
                            ...announcementUser,
                            surname: e.target.value,
                        })
                    }
                />
                <MyInput
                    title="Готов(а) платить в месяц:"
                    type="number"
                    value={
                        announcementUser.price
                    }
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setAnnouncementUser({
                            ...announcementUser,
                            price: e.target.value,
                        })
                    }
                />
                <SelectRussiaCity
                    title="Город проживания:"
                    city={user?.city}
                    setAddress={(value) =>
                        setAnnouncementUser({
                            ...announcementUser,
                            city: value as string,
                        })
                    }
                />
                {error && <MyError error={error} />}
                <MyButton
                    disabled={isLoading}
                    onClick={handlerSubmit}>{isLoading ? 'Создание...' : 'Завершить'}</MyButton>
            </div>
        </div>
    );
};

export default Page;
