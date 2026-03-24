import React from 'react';
import styles from './TextArea.module.css';

const TextArea = ({ title = '', maxLength = 500, toolTib = '', ...props }) => {
    return (
        <div className={styles.MyTextArea}>
            <div className='flex flex-row align-items gap-4'>
                <span className={styles.title}>{title}</span>
                <div
                    className='
                    border 
                    rounded-[50%] 
                    w-6
                    h-6 
                    flex 
                    justify-center 
                    align-items 
                    text-1xl 
                    hover:[var(--main-color-hover)]'
                    title={toolTib}>?</div>
            </div>
            <textarea
                {...props}
                className={styles.testArea}
                maxLength={maxLength}
            ></textarea>
        </div>
    );
};

export default TextArea;
