import styles from './MyError.module.css';

interface Props {
    error: string;
}

export default function MyError({ error }: Props) {
    return <>{error && <div className={styles.container}>{error}</div>}</>;
}
