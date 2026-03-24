import { ApiService } from '@/services/ApiService';
import { IHouseAnnouncement } from '@/models/IHouseAnnouncement';
import { UUID } from 'node:crypto';
import { ServerResponse } from '@/DTO/response/ServerResponse';
import { UpdateHouseAnnouncement } from '@/DTO/request/UpdateHouseAnnouncement';
import { AnnouncementRequest } from '@/DTO/request/AnnouncementRequest';
import { CreateAnnouncementRequest } from '@/DTO/request/CreateAnnouncementRequest';
import { AxiosInstance } from 'axios';

export default class HouseAnnouncementService {
    constructor(private api: AxiosInstance) {}
    async getAll(): Promise<AnnouncementRequest[]> {
        const { data } =
            await this.api.get<AnnouncementRequest[]>(`/announcementsHouse`);

        return data;
    }

    async getById(id: string) {
        const { data } = await this.api.get<IHouseAnnouncement>(
            `/announcementsHouse/${id}`
        );

        return data;
    }

    async getByCity(city: string) {
        const { data } = await this.api.get<AnnouncementRequest[]>(
            `/announcementsHouse/city/${city}`
        );

        return data;
    }

    async create(announcementFlat: CreateAnnouncementRequest): Promise<UUID> {
        const { data } = await this.api.post<UUID>(
            `/announcementsHouse`,
            announcementFlat
        );

        return data;
    }

    async edit(announcement: UpdateHouseAnnouncement) {
        const { data } = await this.api.patch<ServerResponse>(
            `/announcementsHouse`,
            announcement
        );

        return data;
    }

    async getByAnnouncementId(id: UUID) {
        const { data } = await this.api.get<IHouseAnnouncement>(
            `/announcementsHouse/${id}`
        );

        return data;
    }

    async getByUserId(id: UUID) {
        const { data } = await this.api.get<AnnouncementRequest[]>(
            `/announcementsHouse/user/${id}`
        );

        return data;
    }

    async deleteById(id: UUID) {
        const { data } = await this.api.delete<ServerResponse>(
            `/announcementsHouse/${id}`
        );

        return data;
    }
}
