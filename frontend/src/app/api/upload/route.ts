import { getS3Client } from '@/lib/s3/server';
import getRandomString from '@/utils/getRandomString';
import { myConfig } from '@/utils/myConfig';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface PresignBody {
    fileName: string;
    fileType: string;
    fileSize: number;
    folderName: string;
}

export async function POST(request: Request) {
    const body: PresignBody = await request.json();
    const { fileName, fileType, fileSize, folderName } = body;

    if (!fileType.startsWith('image/')) {
        return Response.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (fileSize > 10 * 1024 * 1024) {
        return Response.json({ error: 'File too large' }, { status: 400 });
    }

    const s3Client = getS3Client();

    const s3Key = `${folderName}/${getRandomString(32)}-${fileName}`;

    const signedUrl = await getSignedUrl(
        s3Client,
        new PutObjectCommand({
            Bucket: myConfig.BUCKET_NAME,
            Key: s3Key,
            ContentType: fileType,
            ContentLength: fileSize,
        }),
        { expiresIn: 60 }
    );

    return Response.json({ signedUrl, s3Key });
}
