import React, { InputHTMLAttributes } from 'react';
import styles from './MyInput.module.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    title?: string;
}

export default function MyInput({ title = '', ...props }: Props) {
    return (
        <div
            className={styles.MyInput}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}>
            <span className={styles.title}>{title}</span>
            <input {...props} className={styles.input} />
        </div>
    );
}
