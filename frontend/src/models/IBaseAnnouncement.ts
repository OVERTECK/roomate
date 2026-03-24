import { UUID } from 'node:crypto';
import { IUserEntity } from '@/models/IUserEntity';

export interface IBaseAnnouncement {
    id: UUID;
    description: string;
    city: string;
    createdAt: Date;
    updatedAt: Date;
    price: number;
    mainPhotoUrl: string;
    createdUserId: UUID;
    createdUser: IUserEntity;
}
