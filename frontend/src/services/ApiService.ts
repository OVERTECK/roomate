import axios from 'axios';
import { getApiUrl } from '@/utils/getApiUrl';

export const ApiService = axios.create({
    baseURL: getApiUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});
