import { AxiosInstance } from 'axios';

export class LoginService {
    constructor(private api: AxiosInstance) {}

    async Login(email: string, password: string) {
        const { data } = await this.api.post(`/login`, {
            email: email,
            password: password,
        });

        const { token, user } = await data;

        return { token, user };
    }
}
