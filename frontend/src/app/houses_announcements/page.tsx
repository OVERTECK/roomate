'use client';

import React, { Suspense, useState } from 'react';
import HouseAnnouncementService from '@/services/HouseAnnouncementService';
import SelectRussiaCity from '@/components/SelectRussiaCity/SelectRussiaCity';
import { useAuth } from '@/hooks/useAuth';
import MyModal from '@/components/MyModal/MyModal';
import { SelectTypeAnnouncements } from '@/components/SelectTypeAnnouncements/SelectTypeAnnouncements';
import AddressIcon from '@/components/icons/AddressIcon';
import HouseAnnouncementsList from '@/components/HouseAnnouncementList/HouseAnnouncementList';
import { useSearchParams } from 'next/navigation';
import FilterAndSortAnnouncements from '@/components/FilterAndSortAnnouncements/FilterAndSortAnnouncements';
import AnnouncementContainer from '@/components/AnnouncementContainer/AnnouncementContainer';
import Loader from '@/components/Loader/Loader';
import { ModalCitySelect } from '@/components/ModalCitySelect/ModalCitySelect';
import { houseAnnouncementService } from '@/services';

function HomeContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const [showFilterModal, setShowFilterModal] = useState(false);
    const cityInParams = searchParams.get('city');
    const [city, setCity] = useState(cityInParams || user?.city || 'Москва');
    const [filterPrice, setFilterPrice] = useState({ min: 0, max: 0 });
    const [sort, setSort] = useState<string | null>(null);
    const [isVisibleChangeAddress, setIsVisibleChangeAddress] = useState(false);

    return (
        <div className="flex gap-8">
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
            <div className="flex flex-col w-full gap-5">
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
                    queryKey="announcements"
                    queryFn={(city) => houseAnnouncementService.getByCity(city)}
                    ListComponent={HouseAnnouncementsList}
                    filterPrice={filterPrice}
                    sort={sort}
                    city={city}
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

export default function Home() {
    return (
        <Suspense fallback={<Loader />}>
            <HomeContent />
        </Suspense>
    );
}
