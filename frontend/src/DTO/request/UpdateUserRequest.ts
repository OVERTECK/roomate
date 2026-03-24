import { UUID } from 'node:crypto';

export interface UpdateUserRequest {
    id?: string;
    // email?: string;
    // phoneNumber?: string;
    surname?: string;
    name?: string;
    patronymic: string | null;
    age?: number;
    country?: string;
    city?: string;
    photoUrl?: string;
}
