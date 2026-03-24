import React from 'react';
import styles from './MyButton.module.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    type?: 'submit' | 'reset' | 'button' | undefined;
}

export default function MyButton({ type = 'submit', ...props }: Props) {
    return (
        <button type={type} className={styles.btn} {...props}>
            {props.children}
        </button>
    );
}
