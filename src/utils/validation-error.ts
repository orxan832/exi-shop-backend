import { ValidationPipe, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { FileUpload } from 'graphql-upload-ts';

export class CustomValidationPipe extends ValidationPipe {
    createExceptionFactory() {
        return (validationErrors = []) => {
            const errors = validationErrors.map(error => Object.values(error.constraints)).flat().join('; ');
            return new BadRequestException({ message: errors });
        };
    }
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
    transform(file: FileUpload): FileUpload {
        const { mimetype, createReadStream } = file;

        // Validate MIME type
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        if (!allowedMimeTypes.includes(mimetype)) {
            console.log(mimetype);
            throw new BadRequestException('Invalid file type. Only JPEG and PNG are allowed');
        }

        // Validate file size
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        const fileStream = createReadStream();
        let fileSize = 0;
        fileStream.on('data', (chunk) => {
            fileSize += chunk.length;
            if (fileSize > MAX_FILE_SIZE) {
                fileStream.destroy()
                throw new BadRequestException('File size exceeds the 5MB limit ha ha ha');
            }
        });

        fileStream.on('error', (error) => {
            throw new BadRequestException(`File stream error: ${error.message}`)
        });

        return file
    }
}
