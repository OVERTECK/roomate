import styles from './PriceAnnouncement.module.css';
import { splitDigit } from '@/utils/splitDigit';

export function PriceAnnouncement({ price }: { price: number }) {
    return (
        <span className={styles.price}>{splitDigit(price, '.')} руб/месяц</span>
    );
}
