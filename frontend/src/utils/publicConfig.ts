import z from 'zod';

const envShema = z.object({
    NEXT_PUBLIC_MAP_API_KEY: z.string().nonempty('MAP_API_KEY is required'),
    NEXT_PUBLIC_SUGGEST_API_KEY: z
        .string()
        .nonempty('SUGGEST_API_KEY is required'),
    NEXT_PUBLIC_API_DADATA: z.string().nonempty('DADATA_API_KEY is required'),
});

const config = {
    NEXT_PUBLIC_MAP_API_KEY: process.env.NEXT_PUBLIC_MAP_API_KEY,
    NEXT_PUBLIC_SUGGEST_API_KEY: process.env.NEXT_PUBLIC_SUGGEST_API_KEY,
    NEXT_PUBLIC_API_DADATA: process.env.NEXT_PUBLIC_API_DADATA,
};

export const publicConfig = envShema.parse(config);
