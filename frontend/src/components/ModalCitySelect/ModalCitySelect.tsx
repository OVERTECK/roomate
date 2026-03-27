import React from 'react';
import MyModal from '@/components/MyModal/MyModal';
import SelectRussiaCity from '@/components/SelectRussiaCity/SelectRussiaCity';
import { SearchIcon } from '../icons/SearchIcon';

interface ModalCitySelectProps {
    isVisibleChangeAddress: boolean;
    setIsVisibleChangeAddress: React.Dispatch<React.SetStateAction<boolean>>;
    setCity: (city: string) => void;
    city: string;
}

export function ModalCitySelect({
    isVisibleChangeAddress,
    setIsVisibleChangeAddress,
    setCity,
    city,
}: ModalCitySelectProps) {
    return (
        <MyModal
            visible={isVisibleChangeAddress}
            setVisible={setIsVisibleChangeAddress}
            positionStyle={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            isCloseOnClickToVoid={true}
        >
            <div className="h-[50vh] p-3">
                <header className="text-lg font-medium mb-4">
                    Выберите город:
                </header>
                <SelectRussiaCity
                    title=""
                    city={city}
                    setAddress={(e) => {
                        const city = e as string;

                        if (city) {
                            setCity(city);
                            setIsVisibleChangeAddress(false);
                        }
                    }}
                />
            </div>
        </MyModal>
    );
}
