import { IUserEntity } from '@/models/IUserEntity';
import { UpdateUserRequest } from '@/DTO/request/UpdateUserRequest';
import { AxiosInstance } from 'axios';

export class UserService {
    constructor(private api: AxiosInstance) {}

    async getById(userId: string) {
        const { data } = await this.api.get<IUserEntity>(`/users/${userId}`);

        return data;
    }

    async update(userRequest: UpdateUserRequest) {
        const { data } = await this.api.patch<IUserEntity>(
            `/users/${userRequest.id}`,
            userRequest
        );

        return data;
    }
}
