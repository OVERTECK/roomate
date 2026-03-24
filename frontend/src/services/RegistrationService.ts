import { RegistrationRequest } from '@/DTO/request/RegistrationRequest';
import { AxiosInstance } from 'axios';

export class RegistrationService {
    constructor(private api: AxiosInstance) {}

    async Registration(formRegistration: RegistrationRequest) {
        const { data } = await this.api.post(`/registration`, formRegistration);

        const { token, user } = await data;

        return { token, user };
    }
}
