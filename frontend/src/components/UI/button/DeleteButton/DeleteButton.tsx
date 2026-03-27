import React from 'react';
import styles from './DeleteButton.module.css';
import TrashIcon from '@/components/icons/TrashIcon';

const DeleteButton = ({ width = 24, height = 24, ...props }) => {
    return (
        <button className={styles.deleteButton} {...props}>
            <TrashIcon width={width} height={height} />
        </button>
    );
};

export default DeleteButton;
