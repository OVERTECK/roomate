import { HubConnection } from '@microsoft/signalr';
import { Dispatch, SetStateAction } from 'react';
import { IChatParticipant } from '@/models/IChatParticipant';

export interface ChatContextType {
    chats: IChatParticipant[];
    setChats: (
        chats:
            | IChatParticipant[]
            | ((prev: IChatParticipant[]) => IChatParticipant[])
    ) => void;
    connection: HubConnection | undefined;
    selectedChat: IChatParticipant | null;
    setSelectedChat: Dispatch<SetStateAction<IChatParticipant | null>>;
    isVisible: boolean;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
    step: 'Chats' | 'Chat';
    setStep: Dispatch<SetStateAction<'Chats' | 'Chat'>>;
    countUnReadMessages: number;
    setCountUnReadMessages: Dispatch<SetStateAction<number>>;
}
