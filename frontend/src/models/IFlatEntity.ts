import type { IUserEntity } from './IUserEntity.ts';

export interface IFlatEntity {
    id: string;
    floor: number;
    announcementId: string;
    userId: string;
    user: IUserEntity;
}
