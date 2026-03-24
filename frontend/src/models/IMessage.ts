import { UUID } from 'node:crypto';
import { IChat } from '@/models/IChat';

export interface IMessage {
    id: UUID;
    userId: UUID;
    createdAt: Date;
    text: string;
    isRead: boolean;
    chatId: UUID;
    chat: IChat;
}
