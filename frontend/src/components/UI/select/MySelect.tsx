import styles from './MySelect.module.css';

interface Option {
    value: string;
    name: string;
}

interface Props {
    options: Option[];
    defaultOption: string;
    value: string;
    onChange: (sortData: string) => void;
}

const MySelect = ({ options, defaultOption, value, onChange }: Props) => {
    return (
        <select
            className={styles.select}
            value={value}
            onChange={(event) => onChange(event.target.value)}
        >
            <option disabled value="">
                {defaultOption}
            </option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.name}
                </option>
            ))}
        </select>
    );
};

export default MySelect;
