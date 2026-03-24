import { UUID } from 'node:crypto';
import { IUserEntity } from '@/models/IUserEntity';
import { IChat } from '@/models/IChat';

export interface IChatParticipant {
    id: UUID;
    userId: UUID;
    chatId: UUID;
    joinedAt: Date;
    receiverUserId: UUID;
    receiverUser: IUserEntity;
    user: IUserEntity;
    chat: IChat;
}
