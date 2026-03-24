import React from 'react';
import Image from 'next/image';
import MyButton from '@/components/UI/button/MyButton';
import styles from './ProfileWithMessage.module.css';
import { IHouseAnnouncement } from '@/models/IHouseAnnouncement';
import { useAuth } from '@/hooks/useAuth';
import { ICreateChatRequest } from '@/DTO/request/ICreateChatRequest';
import { UUID } from 'node:crypto';
import useChat from '@/hooks/useChat';
import MyError from '@/components/Error/MyError';
import { IUserEntity } from '@/models/IUserEntity';

const ProfileWithMessage = ({
    profileUser,
    showAvatarAndName = true,
}: {
    profileUser: IUserEntity;
    showAvatarAndName: boolean;
}) => {
    const { user } = useAuth();
    const { setIsVisible, connection, setStep } = useChat();

    async function handleMessage({
        userId,
        receivedUserId,
    }: {
        userId: UUID;
        receivedUserId: UUID;
    }) {
        const newChatParticipantRequest: ICreateChatRequest = {
            userId: userId,
            receiveUserId: receivedUserId,
        };

        await connection.invoke('CreateChat', newChatParticipantRequest);

        setIsVisible(true);
        setStep('Chat');
    }

    if (!user) {
        return;
    }

    return (
        <div className={styles.messageBtn}>
            {showAvatarAndName && (
                <div className={styles.profile}>
                    <Image
                        className="w-[150px] h-[150px] object-cover rounded-[50%] border border-black"
                        src={profileUser.photoUrl}
                        alt="Фотография пользователя"
                        width={150}
                        height={150}
                    />
                    <span>{profileUser.surname + ' ' + profileUser.name}</span>
                </div>
            )}
            <MyButton
                onClick={() =>
                    handleMessage({
                        userId: user?.id,
                        receivedUserId: profileUser.id,
                    })
                }
            >
                Написать сообщение
            </MyButton>
        </div>
    );
};

export default ProfileWithMessage;
