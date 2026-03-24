import { isoToDateTime } from '@/utils/formatDate';

describe('Test format date', () => {
    test('Fail: throws error for empty string', () => {
        expect(() => isoToDateTime('')).toThrow();
    });

    test('Fail: throws error for completely invalid string', () => {
        expect(() => isoToDateTime('not a date')).toThrow();
    });
});
