import React from 'react';
import MyError from '@/components/Error/MyError';
import styles from '@/components/HouseAnnouncementList/HouseAnnouncementList.module.css';
import UserAnnouncementCard from '@/components/UserAnnouncementCard/UserAnnouncementCard';
import { IUserAnnouncement } from '@/models/IUserAnnouncement';

export const UsersAnnouncementsList = ({
    announcements,
}: {
    announcements: IUserAnnouncement[];
}) => {
    if (announcements.length === 0) {
        return <MyError error="Объявления не найдены" />;
    }

    return (
        <div className={styles.announcementsList}>
            {announcements.map((announcement) => (
                <UserAnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                />
            ))}
        </div>
    );
};

export default UsersAnnouncementsList;
