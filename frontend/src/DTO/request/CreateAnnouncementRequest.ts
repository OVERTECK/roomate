import { FlatRequest } from '@/DTO/request/FlatRequest';

export interface CreateAnnouncementRequest {
    description: string;
    // country: string;
    city: string;
    street: string;
    houseNumber: string;
    hasGarage: boolean;
    countRooms: number;
    hasLift: boolean;
    maxFloor: number;
    price: number;
    mainPhotoUrl: string;
    createdUserId: string;
    photos: string[];
    // createFlatRequest: FlatRequest | null;
    isPayUtilities: boolean;
    floor: number;
    fullAddress: string;
    hasWashingMachine: boolean;
    hasMicrowave: boolean;
    hasStove: boolean;
    hasFridge: boolean;
    requiredNumberNeighbors: number;
}
