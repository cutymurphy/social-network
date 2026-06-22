import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MediaService {
  private minioClient: Client;

  constructor(private config: ConfigService) {
    this.minioClient = new Client({
      endPoint: this.config.get<string>('MINIO_ENDPOINT')!,
      port: Number(this.config.get<string>('MINIO_PORT')!),
      useSSL: this.config.get<string>('MINIO_USE_SSL') === 'true',
      accessKey: this.config.get<string>('MINIO_ACCESS_KEY')!,
      secretKey: this.config.get<string>('MINIO_SECRET_KEY')!,
    });
  }

  async uploadFile(file: any): Promise<string> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const bucket = 'posts';

    const fileName = `${uuid()}-${file.originalname}`;

    const exists = await this.minioClient.bucketExists(bucket);
    if (!exists) {
      await this.minioClient.makeBucket(bucket);
    }

    await this.minioClient.putObject(bucket, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    return `${this.config.get('MINIO_PUBLIC_URL')}/${bucket}/${fileName}`;
  }

  async deleteFile(fileUrl: string) {
    const bucket = 'posts';

    const fileName = fileUrl.split('/').slice(-1)[0];

    if (!fileName) return;

    try {
      await this.minioClient.removeObject(bucket, fileName);
      return { success: true };
    } catch {
      throw new InternalServerErrorException('Failed to delete file');
    }
  }
}
