import z from 'zod';

const envShema = z.object({
    BUCKET_NAME: z.string().nonempty('BUCKET_NAME is required'),
    S3_URL: z.string().nonempty('NEXT_PUBLIC_S3_URL is required'),
    S3_REGION: z.string().nonempty('NEXT_PUBLIC_S3_REGION is required'),
    S3_ACCESS_KEY: z.string().nonempty('NEXT_PUBLIC_ACCESS_KEY is required'),
    S3_SECRET_KEY: z.string().nonempty('NEXT_PUBLIC_SECRET_KEY is required'),
});

const config = {
    BUCKET_NAME: 'buket2222',
    S3_URL: 'https://s3.ru-7.storage.selcloud.ru',
    S3_REGION: 'ru-7',
    S3_ACCESS_KEY: process.env.ACCESS_KEY,
    S3_SECRET_KEY: process.env.SECRET_KEY,
};

export const myConfig = envShema.parse(config);
