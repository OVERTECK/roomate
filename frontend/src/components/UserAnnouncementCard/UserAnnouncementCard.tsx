import React, { Dispatch, SetStateAction, useState } from 'react';
import styles from './UserAnnouncementCard.module.css';
import Link from 'next/link';
import MyModal from '@/components/MyModal/MyModal';
import MyButton from '@/components/UI/button/MyButton';
import { PriceAnnouncement } from '@/components/PriceAnnouncement/PriceAnnouncement';
import { isoToDateTime } from '@/utils/formatDate';
import Image from 'next/image';
import { IUserAnnouncement } from '@/models/IUserAnnouncement';
import { UserAnnouncementService } from '@/services/UserAnnouncementService';
import DeleteButton from '@/components/UI/button/DeleteButton/DeleteButton';
import { useAuth } from '@/hooks/useAuth';
import EditButton from '@/components/UI/button/EditButton/EditButton';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { userAnnouncementService } from '@/services';

function AnnouncementImage({
    announcement,
}: {
    announcement: IUserAnnouncement;
}) {
    return (
        <div className={styles.announcement_image}>
            <Image
                width={200}
                height={200}
                loading="eager"
                src={announcement.mainPhotoUrl || '/default_user_img.svg'}
                alt="изображение пользователя"
                className={styles.image}
            />
        </div>
    );
}

function AnnouncementContent({
    announcement,
}: {
    announcement: IUserAnnouncement;
}) {
    return (
        <div className={styles.announcement_content}>
            <div className={styles.announcement_main}>
                <h3 className={styles.street}>
                    {announcement.surname} {announcement.name}
                </h3>
                <PriceAnnouncement price={announcement.price} />
                <span className={styles.createAt}>
                    Размещено {isoToDateTime(announcement.createdAt.toString())}
                </span>
            </div>
        </div>
    );
}

const UserAnnouncementCard = ({
    announcement,
}: {
    announcement: IUserAnnouncement;
}) => {
    const [isVisibleDelete, setIsVisibleDelete] = useState<boolean>(false);
    const { user } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();

    async function handlerClickDelete() {
        try {
            await userAnnouncementService.deleteById(announcement.id);

            await queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === 'user_announcements',
            });

            setIsVisibleDelete(false);
        } catch (error) {
            console.error(error);
        }
    }

    async function handlerDelete(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        setIsVisibleDelete(true);
    }

    async function handlerEdit(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        router.push(`/user_announcement/${announcement.id}/edit`);
    }

    return (
        <div className={styles.container}>
            <Link
                href={'/user_announcement/' + announcement.id}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    textDecoration: 'none',
                }}
            >
                <div className={styles.announcement_card}>
                    <AnnouncementImage announcement={announcement} />
                    <AnnouncementContent announcement={announcement} />
                </div>
            </Link>
            {announcement.createdUserId === user?.id && (
                <div className={styles.deleteBtnCont}>
                    <DeleteButton onClick={handlerDelete} />
                    <EditButton onClick={handlerEdit} />
                </div>
            )}
            <MyModal
                visible={isVisibleDelete}
                setVisible={setIsVisibleDelete}
                positionStyle={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                isCloseOnClickToVoid={true}
            >
                <div className={styles.modalDelete}>
                    <header>Вы уверены что хотите удалить объявление?</header>
                    <div className={styles.footerModal}>
                        <MyButton onClick={() => setIsVisibleDelete(false)}>
                            Отмена
                        </MyButton>
                        <MyButton onClick={() => handlerClickDelete()}>
                            Удалить
                        </MyButton>
                    </div>
                </div>
            </MyModal>
        </div>
    );
};

export default UserAnnouncementCard;
