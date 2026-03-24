import React, { Dispatch, SetStateAction } from 'react';
import MyError from '@/components/Error/MyError';
import styles from '@/components/HouseAnnouncementList/HouseAnnouncementList.module.css';
import UserAnnouncementCard from '@/components/UserAnnouncementCard/UserAnnouncementCard';
import { IUserAnnouncement } from '@/models/IUserAnnouncement';
import HouseAnnouncementCard from '@/components/HouseAnnouncementCard/HouseAnnouncementCard';
import { AnnouncementRequest } from '@/DTO/request/AnnouncementRequest';

const UsersAndHouseAnnouncementsList = ({
    userAnnouncements,
    setUserAnnouncements,
    houseAnnouncements,
    setHouseAnnouncements,
}: {
    userAnnouncements: IUserAnnouncement[];
    setUserAnnouncements: Dispatch<SetStateAction<IUserAnnouncement[]>>;
    houseAnnouncements: AnnouncementRequest[];
    setHouseAnnouncements: Dispatch<SetStateAction<AnnouncementRequest[]>>;
}) => {
    if (userAnnouncements.length === 0 && houseAnnouncements.length === 0) {
        return <MyError error="Объявления не найдены" />;
    }

    return (
        <div className={styles.announcementsList}>
            {userAnnouncements.map((announcement: IUserAnnouncement) => (
                <UserAnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                />
            ))}
            {houseAnnouncements.map((announcement: AnnouncementRequest) => (
                <HouseAnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                />
            ))}
        </div>
    );
};

export default UsersAndHouseAnnouncementsList;
