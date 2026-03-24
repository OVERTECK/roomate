import React from 'react';
import styles from './QuestionRadio.module.css';

export default function QuestionRadio({ title = '', name = '', ...props }) {
    return (
        <div className={styles.container}>
            <label className={styles.title}>{title}</label>
            <div className={styles.radioGroup}>
                <div>
                    <label className={styles.radioOption}>
                        <input
                            type="radio"
                            name={name}
                            value="true"
                            {...props}
                        ></input>
                        <span>Да</span>
                    </label>
                </div>
                <div>
                    <label className={styles.radioOption}>
                        <input
                            type="radio"
                            name={name}
                            value="false"
                            {...props}
                        ></input>
                        <span>Нет</span>
                    </label>
                </div>
            </div>
        </div>
    );
}
