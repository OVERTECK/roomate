import React from 'react';
import EditIcon from '@/components/icons/EditIcon';
import styles from './EditButton.module.css';

const EditButton = ({ ...props }) => {
    return (
        <button type="button" className={styles.button} {...props}>
            <EditIcon />
        </button>
    );
};

export default EditButton;
