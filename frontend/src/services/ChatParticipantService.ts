import { IChatParticipant } from '@/models/IChatParticipant';
import { ICreateChatRequest } from '@/DTO/request/ICreateChatRequest';
import { UUID } from 'node:crypto';
import { AxiosInstance } from 'axios';

export class ChatParticipantService {
    constructor(private api: AxiosInstance) {}

    async GetByUserId(userId: UUID): Promise<IChatParticipant[]> {
        const { data } = await this.api.get<IChatParticipant[]>(
            'chats/user/' + userId
        );

        return data;
    }

    async Create(
        createChatRequest: ICreateChatRequest
    ): Promise<IChatParticipant> {
        const { data } = await this.api.post<IChatParticipant>(
            '/chats',
            createChatRequest
        );

        return data;
    }
}
