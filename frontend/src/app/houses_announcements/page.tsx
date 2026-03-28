import { houseAnnouncementService } from '@/services';
import { HouseAnnouncementsClient } from '@/components/HouseAnnouncementsClient/HouseAnnouncementsClient';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ city?: string }> }) {
    const { city: cityParam } = await searchParams;
    const city = cityParam || 'Москва';

    return {
        title: `Поиск соседей в городе ${city} — roomate`,
        description: `Объявления о поиске соседей и совместном проживании в городе ${city}. Найди идеального соседа на roomate.ru`,
    };
}

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ city?: string }>;
}) {
    const { city: cityParam } = await searchParams; // await здесь
    const city = cityParam || 'Москва';

    const initAnnouncements = await houseAnnouncementService.getByCity(city);

    return (
        <HouseAnnouncementsClient
            initialAnnouncements={initAnnouncements}
            initialCity={city}
        />
    );
}
