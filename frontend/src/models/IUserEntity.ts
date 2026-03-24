import type { IHouseAnnouncement } from './IHouseAnnouncement.ts';
import type { IFlatEntity } from './IFlatEntity.ts';
import type { IHouseEntity } from './IHouseEntity.ts';
import { UUID } from 'node:crypto';

export interface IUserEntity {
    id: UUID;
    email: string;
    phoneNumber: string;
    surname: string;
    name: string;
    patronymic: string;
    age: number;
    createdAccount: Date;
    country: string;
    city: string;
    isAdmin: boolean;
    photoUrl: string;
    announcements?: IHouseAnnouncement[];
    flats?: IFlatEntity[];
    houses?: IHouseEntity[];
}
