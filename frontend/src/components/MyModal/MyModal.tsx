import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './MyModal.module.css';
import { createPortal } from 'react-dom';

interface MyModalProps {
    children: React.ReactNode;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    positionStyle: {
        display: 'flex';
        justifyContent: 'start' | 'center' | 'end';
        alignItems: 'start' | 'center' | 'end';
    };
    isCloseOnClickToVoid: boolean;
}

const MyModal = ({
    children,
    visible,
    setVisible,
    positionStyle,
    isCloseOnClickToVoid = true,
}: MyModalProps) => {
    const rootStyles = [styles.modal];
    const [isClient, setIsClient] = useState<boolean>(false);

    if (visible) {
        rootStyles.push(styles.active);
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return createPortal(
        <div
            className={rootStyles.join(' ')}
            onClick={() => setVisible(!isCloseOnClickToVoid)}
            style={visible ? positionStyle : {}}
        >
            <div
                className={styles.content}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
};

export default MyModal;
