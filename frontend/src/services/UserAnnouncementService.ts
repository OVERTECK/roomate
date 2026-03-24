import { UserAnnouncementRequest } from '@/DTO/request/UserAnnouncementRequest';
import { ServerResponse } from '@/DTO/response/ServerResponse';
import { IUserAnnouncement } from '@/models/IUserAnnouncement';
import { UUID } from 'node:crypto';
import { IEditUserAnnouncement } from '@/DTO/request/IEditUserAnnouncement';
import { AxiosInstance } from 'axios';

export class UserAnnouncementService {
    constructor(private api: AxiosInstance) {}

    async edit(announcement: IEditUserAnnouncement) {
        const { data } = await this.api.patch(
            `/usersAnnouncements/${announcement.id}`,
            announcement
        );

        return data;
    }

    async getById(id: UUID) {
        const { data } = await this.api.get<IUserAnnouncement>(
            `/usersAnnouncements/${id}`
        );

        return data;
    }

    async getByCity(city: string) {
        const { data } = await this.api.get<IUserAnnouncement[]>(
            '/usersAnnouncements',
            {
                params: {
                    city: city,
                },
            }
        );

        return data;
    }

    async getByUserId(userId: UUID) {
        const { data } = await this.api.get<IUserAnnouncement[]>(
            `/usersAnnouncements/user/${userId}`
        );

        return data;
    }

    async add(userRequest: UserAnnouncementRequest) {
        const { data } = await this.api.post<ServerResponse>(
            '/usersAnnouncements',
            userRequest
        );

        return data;
    }

    async deleteById(id: UUID) {
        const { data } = await this.api.delete<ServerResponse>(
            `/usersAnnouncements/${id}`
        );

        return data;
    }
}
