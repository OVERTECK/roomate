export const getApiUrl = () =>
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000'
        : 'https://api.roomate.ru';
