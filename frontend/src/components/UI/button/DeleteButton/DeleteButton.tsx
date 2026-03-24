import React from 'react';
import styles from './DeleteButton.module.css';
import TrashIcon from '@/components/icons/TrashIcon';

const DeleteButton = ({ ...props }) => {
    return (
        <button className={styles.deleteButton} {...props}>
            <TrashIcon />
        </button>
    );
};

export default DeleteButton;
