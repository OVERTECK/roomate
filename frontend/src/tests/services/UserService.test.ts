import { UserService } from '@/services/UserService';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('UserService', () => {
    let mock: MockAdapter;
    let service: UserService;
    let api: ReturnType<typeof axios.create>;

    beforeEach(() => {
        api = axios.create();
        mock = new MockAdapter(api);
        service = new UserService(api);
    });

    afterEach(() => {
        mock.reset();
    });

    it('should send correct data in update', async () => {
        const request = {
            id: '123',
            name: 'Test',
            patronymic: null,
        };

        mock.onPatch(`/users/${request.id}`).reply((config) => {
            const data = JSON.parse(config.data);

            expect(data.name).toBe('Test');

            return [200, data];
        });

        await service.update(request);
    });

    it('should throw error when request fails', async () => {
        mock.onGet('/users/123').reply(500);

        await expect(service.getById('123')).rejects.toThrow();
    });
});
