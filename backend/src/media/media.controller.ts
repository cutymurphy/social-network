import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { DeleteMediaDto, POST_FILE_TYPES } from './dto/media.dto';
import { createFileFilter } from './media.helper';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 500 * 1024 * 1024 },
      fileFilter: createFileFilter(POST_FILE_TYPES),
    }),
  )
  upload(@UploadedFile() file: any) {
    return this.mediaService.uploadFile(file);
  }

  @Delete()
  delete(@Body() dto: DeleteMediaDto) {
    return this.mediaService.deleteFile(dto.fileUrl);
  }
}
