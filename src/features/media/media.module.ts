import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { StorageModule } from 'chatbuk-common/dist/features/storage/storage.module';

@Module({
    imports: [StorageModule],
    controllers: [MediaController],
})
export class MediaModule { }
