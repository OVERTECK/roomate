import { AxiosInstance } from 'axios';

export class EmailCodeService {
    constructor(private api: AxiosInstance) {}

    async SendCode(email: string) {
        const { data } = await this.api.post<{ code: number; message: string }>(
            '/email/sendCode',
            email
        );

        return data;
    }

    async CheckEmailCode(email: string, code: string) {
        const { data } = await this.api.post<boolean>('/email/checkCode', {
            email: email,
            code: code,
        });

        return data;
    }
}
