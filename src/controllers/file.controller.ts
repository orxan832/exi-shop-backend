import { Controller, Post, Get, Delete, UploadedFile, UseInterceptors, Param, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/file.service';
import * as multer from 'multer';
import { FileUpload } from 'graphql-upload-ts';

@Controller('file') // REST base URL: /file
export class FileController {
    constructor(private readonly fileService: FileService) { }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: multer.memoryStorage(),
            limits: {
                fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
            },
        }),
    )
    async uploadFile(@UploadedFile() file: FileUpload) {
        const fileUrl = await this.fileService.uploadFile(file);
        return { url: fileUrl };
    }

    @Get('getSignedUrl')
    async getFile(@Query('key') key: string) {
        const fileUrl = await this.fileService.getFileSignedUrl(key);
        return { url: fileUrl };
    }

    @Delete(':key')
    async deleteFile(@Param('key') key: string) {
        await this.fileService.deleteFile(key);
        return { message: 'File deleted successfully' };
    }
}
