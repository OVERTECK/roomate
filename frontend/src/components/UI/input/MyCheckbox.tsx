import styles from './MyCheckbox.module.css';

export default function MyCheckbox({ title = '', ...props }) {
    return (
        <div className={styles.myCheckbox}>
            <label className={styles.title}>{title}</label>
            <input className={styles.input} type="checkbox" {...props} />
        </div>
    );
}
