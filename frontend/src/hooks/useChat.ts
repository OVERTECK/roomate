import { useContext } from 'react';
import { ChatContext } from '@/context/ChatContext';

const useChat = () => {
    const context = useContext(ChatContext);

    if (context === undefined) {
        throw new Error('useChat must be used as an ChatContext');
    }

    return context;
};

export default useChat;
