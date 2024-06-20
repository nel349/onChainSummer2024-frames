import { FrameSession } from '../game-domain/frame-session';
import { Question } from '../game-domain/question';
import { BASE_URL } from '../../api-service-config';
import axios, { AxiosInstance } from 'axios';
import { buildMemoryStorage, setupCache } from 'axios-cache-interceptor/dev';

interface ApiPostParams {
    url: string;
    data: any;
}
/// testing frameID: 66249df51c3fd6482546a4c1

const instance = axios.create() as AxiosInstance;
const api = setupCache(instance as any, {
    storage: buildMemoryStorage(), // Use in-memory storage for caching
    ttl: 1000 * 60 * 5, // Cache TTL (time-to-live) in milliseconds
    methods: ['post', 'get'],
    // debug: console.log
});

async function apiPost({ url, data }: ApiPostParams): Promise<FrameSession> {
    try {
        const response = await api.post(`${BASE_URL}${url}`, data);
        if (response.cached) {
            console.log('Response was served from cache');
        } else {
            console.log('Response was not served from cache');
        }
        return response.data as FrameSession;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getFrameSession = async (id: string) => {
    return apiPost({
        url: '/api/frames/session',
        data: { id },
    });
}

export const getQuestions = async (metaphor_id: string) => {
    try {
        const response = await api.post(
            `${BASE_URL}/api/mongo/getQuestionsByMethaporId`,
            { metaphor_id }
        );
        return response.data as Question[];
    } catch (error) {
        console.error(error);
        throw error;
    }
}