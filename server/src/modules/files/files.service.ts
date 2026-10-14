import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path, { extname } from 'path';
import { cwd } from 'process';
import { ICreateFileOptions } from './files.types';

@Injectable()
export class FilesService {
  async saveImageFile(file: Express.Multer.File, options: ICreateFileOptions) {
    const newFileName = `${randomUUID()}${extname(file.originalname)}`;
    let imageType: string;
    switch (options.type) {
      case 'avatar':
        imageType = 'avatars';
        break;
      case 'bait':
        imageType = 'baits';
        break;
      case 'fish':
        imageType = 'fish';
        break;
      case 'fisherman':
        imageType = 'fishermen';
        break;
      case 'location':
        imageType = 'locations';
        break;
      case 'rod':
        imageType = 'rods';
        break;
    }
    const targetDir = path.join(cwd(), 'public', 'images', imageType);
    const fullPath = path.join(targetDir, newFileName);

    await fs.mkdir(targetDir, { recursive: true });
    try {
      await fs.appendFile(fullPath, file.buffer);
      return `public/images/${imageType}/${newFileName}`;
    } catch {
      throw new InternalServerErrorException('Error while saving image');
    }
  }
}
