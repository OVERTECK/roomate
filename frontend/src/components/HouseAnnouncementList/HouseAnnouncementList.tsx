import AnnouncementHouseCard from '@/components/HouseAnnouncementCard/HouseAnnouncementCard';
import styles from './HouseAnnouncementList.module.css';
import MyError from '@/components/Error/MyError';
import { AnnouncementRequest } from '@/DTO/request/AnnouncementRequest';

export default function HouseAnnouncementsList({
    announcements,
}: {
    announcements: AnnouncementRequest[];
}) {
    if (announcements.length === 0) {
        return <MyError error="Объявления не найдены" />;
    }

    return (
        <div className={styles.announcementsList}>
            {announcements.map((announcement) => (
                <AnnouncementHouseCard
                    key={announcement.id}
                    announcement={announcement}
                />
            ))}
        </div>
    );
}
