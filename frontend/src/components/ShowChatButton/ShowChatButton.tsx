import React from 'react';
import styles from './ShowChatButton.module.css';
import ChatIcon from '@/components/icons/ChatIcon';
import useChat from '@/hooks/useChat';

const ShowChatButton = ({ ...props }) => {
    const { countUnReadMessages } = useChat();

    return (
        <div className={styles.showChatBtn} {...props}>
            <div className={styles.content}>
                {countUnReadMessages !== 0 && (
                    <div className={styles.countUnReadMessages}>
                        {countUnReadMessages}
                    </div>
                )}
                <ChatIcon />
            </div>
        </div>
    );
};

export default ShowChatButton;
