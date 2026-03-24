import { IBaseAnnouncement } from '@/models/IBaseAnnouncement';

export interface IUserAnnouncement extends IBaseAnnouncement {
    name: string;
    surname: string;
}
