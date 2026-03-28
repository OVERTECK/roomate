'use client';

import { AddressSuggestions, DaDataAddress } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';
import styles from '@/components/AddressInput/AddressInput.module.css';
import { publicConfig } from '@/utils/publicConfig';
import { SearchIcon } from '../icons/SearchIcon';
import { useState } from 'react';

interface Props {
    title?: string;
    city?: string;
    setAddress: (value: string) => void;
}

const SelectRussiaCity = ({
    title = 'Город:',
    city = '',
    setAddress,
}: Props) => {
    const [inputValue, setInputValue] = useState(city);

    return (
        <div className={styles.container}>
            <span className={styles.title}>{title}</span>
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

                    setAddress(city);
                    setInputValue(city);
                }}
            />
        </div>
    );
};

export default SelectRussiaCity;
