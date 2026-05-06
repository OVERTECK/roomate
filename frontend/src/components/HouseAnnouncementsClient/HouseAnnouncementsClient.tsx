"use client";

import { useAuth } from "@/hooks/useAuth";
import { houseAnnouncementService } from "@/services";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import AnnouncementContainer from "../AnnouncementContainer/AnnouncementContainer";
import FilterAndSortAnnouncements from "../FilterAndSortAnnouncements/FilterAndSortAnnouncements";
import HouseAnnouncementsList from "../HouseAnnouncementList/HouseAnnouncementList";
import AddressIcon from "../icons/AddressIcon";
import { ModalCitySelect } from "../ModalCitySelect/ModalCitySelect";
import MyModal from "../MyModal/MyModal";
import { SelectTypeAnnouncements } from "../SelectTypeAnnouncements/SelectTypeAnnouncements";
import Loader from "../Loader/Loader";
import { AnnouncementRequest } from "@/DTO/request/AnnouncementRequest";

function HomeContent(
    {
        initialAnnouncements,
        initialCity
    }: {
        initialAnnouncements: AnnouncementRequest[],
        initialCity: string
    }) {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const [showFilterModal, setShowFilterModal] = useState(false);
    const cityInParams = searchParams.get('city');
    const [city, setCity] = useState(cityInParams || user?.city || initialCity);
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
                    initialData={initialAnnouncements}
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

export function HouseAnnouncementsClient({ initialAnnouncements, initialCity }: { initialAnnouncements: AnnouncementRequest[], initialCity: string }) {
    return (
        <Suspense fallback={<Loader />}>
            <HomeContent
                initialAnnouncements={initialAnnouncements}
                initialCity={initialCity}
            />
        </Suspense>
    );
}