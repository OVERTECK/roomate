'use client';

import React, { Suspense, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/Loader/Loader';
import styles from '@/app/houses_announcements/page.module.css';
import { SelectTypeAnnouncements } from '@/components/SelectTypeAnnouncements/SelectTypeAnnouncements';
import AddressIcon from '@/components/icons/AddressIcon';
import MyModal from '@/components/MyModal/MyModal';
import UsersAnnouncementsList from '@/components/UsersAnnouncementsList/UsersAnnouncementsList';
import { useSearchParams } from 'next/navigation';
import FilterAndSortAnnouncements from '@/components/FilterAndSortAnnouncements/FilterAndSortAnnouncements';
import AnnouncementContainer from '@/components/AnnouncementContainer/AnnouncementContainer';
import { userAnnouncementService } from '@/services';
import { ModalCitySelect } from '@/components/ModalCitySelect/ModalCitySelect';

function PageContent() {
    const { user } = useAuth();
    const [showFilterModal, setShowFilterModal] = useState(false);
    const searchParams = useSearchParams();
    const [city, setCity] = useState(
        searchParams.get('city') || user?.city || 'Москва'
    );
    const [isVisibleChangeAddress, setIsVisibleChangeAddress] = useState(false);
    const [filterPrice, setFilterPrice] = useState({ min: 0, max: 0 });
    const [sort, setSort] = useState<string | null>(null);

    return (
        <div className={styles.home}>
            <MyModal
                visible={showFilterModal}
                setVisible={setShowFilterModal}
                positionStyle={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'start',
                }}
                isCloseOnClickToVoid={true}
            >
                <FilterAndSortAnnouncements
                    setFilterPrice={setFilterPrice}
                    filterPrice={filterPrice}
                    sort={sort}
                    setSort={setSort}
                />
            </MyModal>
            <div className={styles.containerAnnouncements}>
                <SelectTypeAnnouncements />
                <div className="flex flex-row items-center gap-5">
                    <div
                        className="
                        flex
                        items-center
                        justify-center
                        cursor-pointer
                        p-2.5
                        rounded-lg
                        transition
                        duration-200
                        hover:bg-[var(--main-color-hover)]"
                        onClick={() => setIsVisibleChangeAddress(true)}
                    >
                        <AddressIcon />
                        <div>{city}</div>
                    </div>
                    <button
                        className="w-fit p-2 rounded-md cursor-pointer hover:bg-[var(--main-color-hover)]"
                        onClick={() => setShowFilterModal(true)}
                    >
                        Фильтрация и сортировка
                    </button>
                </div>
                <AnnouncementContainer
                    queryKey="user_announcements"
                    queryFn={(city) => userAnnouncementService.getByCity(city)}
                    ListComponent={UsersAnnouncementsList}
                    sort={sort}
                    city={city}
                    filterPrice={filterPrice}
                />
            </div>
            <ModalCitySelect
                isVisibleChangeAddress={isVisibleChangeAddress}
                setIsVisibleChangeAddress={setIsVisibleChangeAddress}
                setCity={setCity}
                city={city}
            />
        </div>
    );
}

const Page = () => {
    return (
        <Suspense fallback={<Loader />}>
            <PageContent />
        </Suspense>
    );
};

export default Page;
