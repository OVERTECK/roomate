import React from 'react';
import MySelect from '@/components/UI/select/MySelect';
import {
    FilterByPriceAnnouncements,
    FilterPriceType,
} from '@/components/FilterAnnouncements/FilterByPriceAnnouncements';

const FilterAndSortAnnouncements = ({
    setFilterPrice,
    filterPrice,
    sort,
    setSort,
}: {
    setFilterPrice: (filterPrice: FilterPriceType) => void;
    filterPrice: FilterPriceType;
    sort: string | null;
    setSort: (value: string) => void;
}) => {
    return (
        <div className="p-5 flex flex-col items-center gap-5 rounded-lg">
            <FilterByPriceAnnouncements
                setFilterPrice={setFilterPrice}
                filterPrice={filterPrice}
            />
            <MySelect
                value={sort ?? ''}
                onChange={setSort}
                defaultOption="Сортировка"
                options={[
                    { value: 'price.ASC', name: 'По цене (дешёвые - дорогие)' },
                    {
                        value: 'price.DESC',
                        name: 'По цене (дорогие - дешёвые)',
                    },
                    {
                        value: 'updatedAt.ASC',
                        name: 'По дате создания (новые - старые)',
                    },
                    {
                        value: 'updatedAt.DESC',
                        name: 'По дате создания (старые - новые)',
                    },
                ]}
            />
        </div>
    );
};

export default FilterAndSortAnnouncements;
