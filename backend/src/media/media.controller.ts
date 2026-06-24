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
import { DeleteMediaDto } from './dto/media.dto';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: any) {
    return this.mediaService.uploadFile(file);
  }

  @Delete()
  delete(@Body() dto: DeleteMediaDto) {
    return this.mediaService.deleteFile(dto.fileUrl);
  }
}
