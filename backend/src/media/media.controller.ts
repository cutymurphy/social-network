import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DeleteMediaDto } from './dto/media.dto';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: any) {
    return this.mediaService.uploadFile(file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  delete(@Body() dto: DeleteMediaDto) {
    return this.mediaService.deleteFile(dto.fileUrl);
  }
}
