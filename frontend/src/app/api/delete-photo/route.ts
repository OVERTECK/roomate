import { getS3Client } from '@/lib/s3/server';
import { myConfig } from '@/utils/myConfig';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

export async function DELETE(request: Request) {
    const { s3Key } = await request.json();

    const s3Client = getS3Client();
    await s3Client.send(
        new DeleteObjectCommand({
            Bucket: myConfig.BUCKET_NAME,
            Key: s3Key,
        })
    );

    return Response.json({ ok: true });
}
