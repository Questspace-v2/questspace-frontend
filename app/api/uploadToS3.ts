'use server';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export default async function uploadToS3(
    key: string,
    fileType: string,
    body: FormData,
) {
    const file = body.get('file') as Blob;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const bucketName = 'questspace-img';
    const s3Client = new S3Client({
        region: 'ru-central1',
        endpoint: 'https://storage.yandexcloud.net',
        requestChecksumCalculation: 'WHEN_REQUIRED',
        forcePathStyle: true,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
            secretAccessKey: process.env.AWS_SECRET_KEY_ID ?? '',
        }
    });

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: fileType,
    };

    const command = new PutObjectCommand(params);
    try {
        await s3Client.send(command);
        return `https://storage.yandexcloud.net/${bucketName}/${key}`;
    } catch (err) {
        throw new Error('An error occurred during image upload');
    }
}