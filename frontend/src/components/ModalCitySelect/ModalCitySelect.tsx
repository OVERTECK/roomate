import React, { useState } from 'react';
import MyModal from '@/components/MyModal/MyModal';
import { SearchIcon } from '../icons/SearchIcon';
import styles from "./ModalCitySelect.module.css";
import { publicConfig } from '@/utils/publicConfig';
import { AddressSuggestions, DaDataAddress } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

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
    const [inputValue, setInputValue] = useState(city);

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
                <div className={styles.container}>
                    <div className={styles.wrapprerInput}>
                        <SearchIcon className={styles.searchIcon} />
                        <button className={styles.deleteBtn} onClick={() => setInputValue('')}>
                            X
                        </button>
                        <AddressSuggestions
                            inputProps={{
                                className: styles.inputAddress,
                            }}
                            token={publicConfig.NEXT_PUBLIC_API_DADATA}
                            filterFromBound="city"
                            filterToBound="city"
                            delay={100}
                            count={3}
                            selectOnBlur
                            value={
                                city
                                    ? {
                                        value: inputValue,
                                        unrestricted_value: inputValue,
                                        data: {} as DaDataAddress,
                                    }
                                    : undefined
                            }
                            httpCache
                            renderOption={(suggestion) => suggestion.data.city}
                            onChange={(data) => {
                                const city = data?.data.city as string;

                                setCity(city);
                                setInputValue(city);
                                setIsVisibleChangeAddress(false);
                            }}
                        />
                    </div>
                </div>
            </div>
        </MyModal>
    );
}
