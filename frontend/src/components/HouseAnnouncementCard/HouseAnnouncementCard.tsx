import styles from './HouseAnnouncementCard.module.css';
import { isoToDateTime } from '@/utils/formatDate';
import Link from 'next/link';
import Image from 'next/image';
import { PriceAnnouncement } from '@/components/PriceAnnouncement/PriceAnnouncement';
import DeleteButton from '@/components/UI/button/DeleteButton/DeleteButton';
import { useAuth } from '@/hooks/useAuth';
import HouseAnnouncementService from '@/services/HouseAnnouncementService';
import MyModal from '@/components/MyModal/MyModal';
import MyButton from '@/components/UI/button/MyButton';
import React, { Dispatch, SetStateAction, useState } from 'react';
import EditButton from '@/components/UI/button/EditButton/EditButton';
import { useRouter } from 'next/navigation';
import { AnnouncementRequest } from '@/DTO/request/AnnouncementRequest';
import { useQueryClient } from '@tanstack/react-query';
import { houseAnnouncementService } from '@/services';

function AnnouncementImage({
    announcement,
}: {
    announcement: AnnouncementRequest;
}) {
    return (
        <div className={styles.announcement_image}>
            <Image
                // width={200}
                // height={200}
                fill
                sizes="300px"
                loading="eager"
                src={announcement.mainPhotoUrl}
                alt="изображение квартиры"
                className={styles.image}
            />
        </div>
    );
}

function AnnouncementUserInfo({
    announcement,
}: {
    announcement: AnnouncementRequest;
}) {
    return (
        <Link
            href={'/profile/' + announcement.createdUser.id}
            className={styles.announcement_user}
        >
            <Image
                src={announcement.createdUser.photoUrl as string}
                width={100}
                height={100}
                alt="Фотография квартиры"
                className={styles.user_image}
            />
            <span className={styles.user_name}>
                {announcement.createdUser.name}
            </span>
        </Link>
    );
}

function AnnouncementContent({
    announcement,
}: {
    announcement: AnnouncementRequest;
}) {
    return (
        <div className={styles.announcement_content}>
            <div className={styles.announcement_main}>
                <h3 className={styles.street}>{announcement.fullAddress}</h3>
                <PriceAnnouncement price={announcement.price} />
                <span className={styles.createAt}>
                    Размещено {isoToDateTime(announcement.createdAt.toString())}
                </span>
            </div>
        </div>
    );
}

interface DeleteButtonModalProps {
    isVisibleDelete: boolean;
    setIsVisibleDelete: React.Dispatch<React.SetStateAction<boolean>>;
    announcement: AnnouncementRequest;
}

function DeleteButtonModal({
    isVisibleDelete,
    setIsVisibleDelete,
    announcement,
}: DeleteButtonModalProps) {
    const queryClient = useQueryClient();

    async function handlerClickDelete() {
        try {
            await houseAnnouncementService.deleteById(announcement.id);

            await queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === 'announcements',
            });

            setIsVisibleDelete(false);
        } catch (error) {
            console.error(error);
        }
    }

    return (
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
                    <MyButton
                        type="button"
                        onClick={() => setIsVisibleDelete(false)}
                    >
                        Отмена
                    </MyButton>
                    <MyButton
                        type="button"
                        onClick={() => handlerClickDelete()}
                    >
                        Удалить
                    </MyButton>
                </div>
            </div>
        </MyModal>
    );
}

const HouseAnnouncementCard = ({
    announcement,
}: {
    announcement: AnnouncementRequest;
}) => {
    const { user } = useAuth();
    const [isVisibleDelete, setIsVisibleDelete] = useState<boolean>(false);
    const router = useRouter();

    async function handlerDelete(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        setIsVisibleDelete(true);
    }

    async function handlerEdit(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        router.push(`/house_announcement/${announcement.id}/edit`);
    }

    return (
        <div className={styles.container}>
            <Link
                href={'/house_announcement/' + announcement.id}
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
            <AnnouncementUserInfo announcement={announcement} />
            {announcement.createdUser.id === user?.id && (
                <div className={styles.deleteBtnCont}>
                    <DeleteButton onClick={handlerDelete} />
                    <EditButton onClick={handlerEdit} />
                </div>
            )}
            <DeleteButtonModal
                announcement={announcement}
                isVisibleDelete={isVisibleDelete}
                setIsVisibleDelete={setIsVisibleDelete}
            />
        </div>
    );
};

export default HouseAnnouncementCard;
