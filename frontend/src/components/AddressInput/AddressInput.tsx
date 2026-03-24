'use client';

import {
    AddressSuggestions,
    DaDataAddress,
    DaDataSuggestion,
} from 'react-dadata';
import styles from './AddressInput.module.css';
import { publicConfig } from '@/utils/publicConfig';

interface Props {
    address: DaDataSuggestion<DaDataAddress> | undefined;
    setAddress: (address: DaDataSuggestion<DaDataAddress>) => void;
    fullAddress: string;
    setFullAddress: (address: string) => void;
}

const AddressInput = ({
    address,
    setAddress,
    fullAddress,
    setFullAddress,
}: Props) => {
    return (
        <div className={styles.container}>
            <div className={styles.title}>Адрес:</div>
            <AddressSuggestions
                containerClassName={styles.containerAddress}
                suggestionClassName={styles.suggestionAddress}
                highlightClassName={styles.highlightAddress}
                inputProps={{
                    className: styles.inputAddress,
                }}
                token={publicConfig.NEXT_PUBLIC_API_DADATA}
                delay={500}
                value={
                    fullAddress
                        ? {
                            value: fullAddress,
                            unrestricted_value: fullAddress,
                            data: {} as DaDataAddress,
                        }
                        : undefined
                }
                count={3}
                selectOnBlur
                httpCache
                onChange={(e) => {
                    if (!e) return;

                    setFullAddress(e.value);

                    setAddress(e as DaDataSuggestion<DaDataAddress>);
                }}
            />
        </div>
    );
};

export default AddressInput;
