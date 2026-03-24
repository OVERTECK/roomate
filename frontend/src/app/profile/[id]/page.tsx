'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Image from 'next/image';
import MyError from '@/components/Error/MyError';
import styles from './styles.module.css';
import MyButton from '@/components/UI/button/MyButton';
import { useAuth } from '@/hooks/useAuth';
import { UUID } from 'node:crypto';
import { ICreateChatRequest } from '@/DTO/request/ICreateChatRequest';
import useChat from '@/hooks/useChat';
import Loader from '@/components/Loader/Loader';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services';

export default function Profile() {
    const router = useRouter();
    const params = useParams<{ id: UUID }>();
    const idUserPage = params.id;
    const { user, logout, isAuthLoading, isAuth } = useAuth();
    const { setIsVisible, connection, setStep, setSelectedChat, chats } =
        useChat();
    const { data, isLoading, error } = useQuery({
        queryKey: ['user', idUserPage],
        queryFn: async () => await userService.getById(idUserPage),
    });

    function checkExistingChat(receiverUserId: UUID) {
        return chats.some(
            (chat) =>
                chat.receiverUserId === receiverUserId ||
                chat.userId === receiverUserId
        );
    }

    async function handleMessage({
        userId,
        receivedUserId,
    }: {
        userId?: UUID;
        receivedUserId: UUID;
    }) {
        try {
            if (!userId || !receivedUserId) return null;

            if (checkExistingChat(receivedUserId)) {
                const existChat = chats.find(
                    (chat) =>
                        chat.receiverUserId === receivedUserId ||
                        chat.userId === receivedUserId
                );

                if (existChat) {
                    setStep('Chat');
                    setSelectedChat(existChat);
                    setIsVisible(true);
                }

                return;
            }

            const newChatParticipantRequest: ICreateChatRequest = {
                userId: userId,
                receiveUserId: receivedUserId,
            };

            await connection?.invoke('CreateChat', newChatParticipantRequest);

            setIsVisible(true);
            setStep('Chat');
        } catch (error) {
            console.error(error);
        }
    }

    // useEffect(() => {
    //     if (!isAuthLoading) {
    //         if (!isAuth || user === null) {
    //             router.push('/login');
    //         }
    //     }
    // }, [isAuthLoading, isAuth, user, router]);

    if (isLoading) {
        return <Loader />;
    }

    if (!data) {
        return <MyError error="Пользователь не найден" />;
    }

    if (error) return <MyError error={error.message} />;

    return (
        <div className={styles.profile}>
            <div className={styles.content}>
                <Image
                    priority={true}
                    width={800}
                    height={800}
                    className={styles.photo}
                    src={data.photoUrl}
                    alt="фотография пользователя"
                />
                <span className={styles.surname}>
                    {data.surname} {data.name}
                </span>
                <div className={styles.userData}>
                    {/*<span>Возраст: {userProfile.age}</span>*/}
                    <span>Страна: {data.country || 'Не указано'}</span>
                    <span>Город: {data.city || 'Не указано'}</span>
                    <span>
                        Аккаунт создан:{' '}
                        {new Date(data.createdAccount).toLocaleDateString()}
                    </span>
                </div>
                <div className={styles.containerOpportunities}>
                    {idUserPage !== user?.id && (
                        <MyButton
                            onClick={() =>
                                handleMessage({
                                    userId: user?.id,
                                    receivedUserId: idUserPage,
                                })
                            }
                        >
                            Написать сообщение
                        </MyButton>
                    )}
                    <MyButton
                        onClick={() =>
                            router.push(`/profile/${idUserPage}/announcements`)
                        }
                    >
                        Объявления
                    </MyButton>
                    {data.id === user?.id && (
                        <div className={styles.authContainer}>
                            <MyButton
                                onClick={() => router.push('/profile/edit')}
                            >
                                Редактировать пользователя
                            </MyButton>
                            <MyButton onClick={() => logout()}>Выход</MyButton>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
