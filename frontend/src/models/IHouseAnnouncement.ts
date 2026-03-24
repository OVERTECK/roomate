import type { IAnnouncementPhoto } from './IAnnouncementPhoto.ts';
import type { IUserEntity } from './IUserEntity.ts';
import { UUID } from 'node:crypto';
import { IBaseAnnouncement } from '@/models/IBaseAnnouncement';

export interface IHouseAnnouncement extends IBaseAnnouncement {
    street: string;
    houseNumber: string;
    hasGarage: boolean;
    createdHouse: number;
    countRooms: number;
    hasLift: boolean;
    maxFloor: number;
    photos: IAnnouncementPhoto[];
    photosUrls: string[];
    isPayUtilities: boolean;
    fullAddress: string;
    floor: number;
    hasWashingMachine: boolean;
    hasMicrowave: boolean;
    hasStove: boolean;
    hasFridge: boolean;
    requiredNumberNeighbors: number;
}
