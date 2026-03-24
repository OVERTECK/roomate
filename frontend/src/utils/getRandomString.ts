import randomString from 'randomstring';

export default function getRandomString(length: number): string {
    return randomString.generate({
        length,
        charset: 'alphanumeric',
        capitalization: 'lowercase',
    });
}
