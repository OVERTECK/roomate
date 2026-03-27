import { UUID } from 'node:crypto';

export interface AnnouncementRequest {
    id: UUID;
    description: string;
    country: string;
    city: string;
    street: string;
    houseNumber: string;
    hasGarage: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdHouse: Date;
    countRooms: number;
    hasLift: boolean;
    maxFloor: number;
    price: number;
    mainPhotoUrl: string;
    createdUser: {
        id: string;
        surname: string;
        photoUrl?: string;
        name: string;
        patronymic: string;
        age: number;
    };
    fullAddress: string;
    requiredNumberNeighbors: number;
}
