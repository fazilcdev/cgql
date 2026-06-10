import { BadRequestException, Controller, Post, Get, Query, UseInterceptors, UploadedFile, UseGuards, Req, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GqlAuthGuard } from '../../common/authentication/guards/gql-auth.guard';
import { StorageService } from 'chatbuk-common/dist/features/storage/storage.service';

@Controller('media')
export class MediaController {
    private readonly logger = new Logger(MediaController.name);

    constructor(private readonly storageService: StorageService) { }

    @Post('upload')
    @UseGuards(GqlAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
        const user = req.user;
        this.logger.log(`Uploading file for user ${user?.id}`);

        if (!file) {
            throw new BadRequestException('File is required');
        }

        const result = await this.storageService.uploadFile(
            user.id,
            file.buffer,
            file.originalname,
            file.mimetype
        );

        const presignedUrl = await this.storageService.getPresignedUrl(result.key);

        return {
            success: true,
            key: result.key,
            url: presignedUrl // Return presigned URL for immediate access
        };
    }

    @Get('presigned-url')
    @UseGuards(GqlAuthGuard)
    async getPresignedUrl(
        @Query('filename') filename: string,
        @Query('mimetype') mimetype: string,
        @Query('key') key: string,
        @Req() req
    ) {
        // If key is provided, return a GET url for display
        if (key) {
            if (/^(blob:|data:|https?:\/\/)/i.test(key)) {
                throw new BadRequestException('Invalid storage key');
            }

            const url = await this.storageService.getPresignedUrl(key);
            return {
                url,
                key,
                success: true
            };
        }

        const user = req.user;
        // Generate key using same logic: userId/YEAR/uuid.ext
        const year = new Date().getFullYear();
        const ext = filename?.split('.').pop() || 'bin';
        const { v4: uuidv4 } = require('uuid'); // Import here or at top level if available
        const newKey = `${user.id}/${year}/${uuidv4()}.${ext}`;

        const url = await this.storageService.getPresignedPutUrl(newKey, mimetype);

        return {
            url,
            key: newKey,
            success: true
        };
    }
}
