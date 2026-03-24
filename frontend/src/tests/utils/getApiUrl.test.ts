import { getApiUrl } from '@/utils/getApiUrl';

describe('getApiUrl', () => {
    test('dev mode', () => {
        // @ts-ignore
        process.env.NODE_ENV = 'development';

        expect(getApiUrl()).toBe('http://localhost:8000');
    });

    test('prod mode', () => {
        // @ts-ignore
        process.env.NODE_ENV = 'production';

        expect(getApiUrl()).toBe('https://api.roomate.ru');
    });
});
