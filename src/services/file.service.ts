import { BadRequestException, Injectable } from '@nestjs/common';
import { PutObjectCommand, DeleteObjectCommand, S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { FileUpload } from 'graphql-upload-ts';
import { streamToBuffer } from 'src/utils/helper';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Readable } from 'stream';

@Injectable()
export class FileService {
    private readonly regionName = process.env.AWS_REGION_NAME;
    private readonly accesskeyId = process.env.AWS_ACCESS_KEY_ID;
    private readonly secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    private readonly bucketName = process.env.AWS_S3_BUCKET_NAME;
    private readonly s3Client = new S3Client({
        region: this.regionName,
        credentials: {
            accessKeyId: this.accesskeyId,
            secretAccessKey: this.secretAccessKey
        },
    });

    async uploadFile(file: FileUpload): Promise<string> {
        try {
            const key = `categories/${Date.now()}-${file.filename.split(' ').join('_')}`;
            const stream = file.createReadStream()

            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: (await streamToBuffer(stream)),
                ContentType: file.mimetype,
            });

            await this.s3Client.send(command);

            return key;
        } catch (err) {
            console.log(err);
        }
    }

    // Get a signed file url from S3
    async getFileSignedUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 5 })
        return signedUrl;
    }

    // Get a file base64 from S3
    async getFileBase64(key: string): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key
            })

            const response = await this.s3Client.send(command)
            const buffer = await streamToBuffer(response.Body as Readable)
            return buffer.toString('base64')
        } catch (err) {
            throw new BadRequestException(err)
        }
    }

    // Delete a file from S3`
    async deleteFile(key: string): Promise<boolean> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });
            await this.s3Client.send(command);
            return true
        } catch (err) {
            console.log(err)
            throw new BadRequestException(err)
        }
    }
}
