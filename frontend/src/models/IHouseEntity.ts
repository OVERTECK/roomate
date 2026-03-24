import type { IHouseAnnouncement } from './IHouseAnnouncement.ts';
import type { IUserEntity } from './IUserEntity.ts';

export interface IHouseEntity {
    id: string;
    announcement?: IHouseAnnouncement;
    user: IUserEntity;
}
