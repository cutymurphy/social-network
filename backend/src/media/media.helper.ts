import { BadRequestException } from '@nestjs/common';

export const createFileFilter =
  (allowedTypes: string[]) => (_req: any, file: any, cb: any) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new BadRequestException('Unsupported file type'), false);
    }

    cb(null, true);
  };
