import 'server-only';

import { myConfig } from '@/utils/myConfig';
import { S3Client } from '@aws-sdk/client-s3';

let s3Client: S3Client | null = null;

export function getS3Client(): S3Client {
    if (!s3Client) {
        s3Client = new S3Client({
            endpoint: myConfig.S3_URL,
            region: myConfig.S3_REGION,
            credentials: {
                accessKeyId: myConfig.S3_ACCESS_KEY,
                secretAccessKey: myConfig.S3_SECRET_KEY,
            },
        });
    }
    return s3Client;
}
