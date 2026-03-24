import { UUID } from 'node:crypto';
import { IMessage } from '@/models/IMessage';

export interface IChat {
    id: UUID;
    createdAt: Date;
    messages: IMessage[];
    lastMessage: string;
}
