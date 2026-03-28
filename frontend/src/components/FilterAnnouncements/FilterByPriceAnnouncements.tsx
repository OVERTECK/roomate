import styles from './FilterAnnouncements.module.css';
import { ChangeEvent, FormEvent, useState } from 'react';
import MyInput from '@/components/UI/input/MyInput';
import MyButton from '../UI/button/MyButton';

export type FilterPriceType = {
    min: number;
    max: number;
};

interface FilterAnnouncementsProps {
    filterPrice: FilterPriceType;
    setFilterPrice: (filterPrice: FilterPriceType) => void;
}

export function FilterByPriceAnnouncements({
    filterPrice,
    setFilterPrice,
}: FilterAnnouncementsProps) {
    const [localFilterPrice, setLocalFilterPrice] =
        useState<FilterPriceType>(filterPrice);
    function handleFilterPrice() {
        setFilterPrice(localFilterPrice);
    }

    return (
        <form className={styles.filterPrice}>
            <span>Стоимость</span>
            <div className={styles.filterPriceInputs}>
                <MyInput
                    placeholder="мин."
                    type="number"
                    value={
                        localFilterPrice.min === 0 ? '' : localFilterPrice.min
                    }
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setLocalFilterPrice({
                            ...localFilterPrice,
                            min: Number(e.target.value),
                        })
                    }
                />
                {/*<span>—</span>*/}
                <MyInput
                    placeholder="макс."
                    type="number"
                    value={
                        localFilterPrice.max === 0 ? '' : localFilterPrice.max
                    }
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setLocalFilterPrice({
                            ...localFilterPrice,
                            max: Number(e.target.value),
                        })
                    }
                />
            </div>
            <button className='flex justify-center w-full p-1 border rounded-[10px] cursor-pointer hover:bg-(--main-color-hover) transition' type="button" onClick={handleFilterPrice}>
                Отфильтровать
            </button>
        </form>
    );
}
