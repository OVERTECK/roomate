import { UUID } from 'node:crypto';
import { CreateAnnouncementRequest } from '@/DTO/request/CreateAnnouncementRequest';

export interface UpdateHouseAnnouncementRequest extends CreateAnnouncementRequest {
    id: UUID;
}
