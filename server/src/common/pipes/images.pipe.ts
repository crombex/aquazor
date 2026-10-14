import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ParseImagePipe implements PipeTransform {
  constructor(private configService: ConfigService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    const maxImageSize =
      Number(this.configService.getOrThrow<number>('MAX_IMAGE_SIZE')) *
      1024 *
      1024;
    const allowedTypes = this.configService.getOrThrow<string>(
      'ALLOWED_IMAGE_TYPES',
    );

    const filePipe = new ParseFilePipe({
      fileIsRequired: false,
      validators: [
        new MaxFileSizeValidator({
          maxSize: maxImageSize,
          message: `File is too large. Maximum size - ${maxImageSize} MB`,
        }),
        new FileTypeValidator({
          fileType: `.(${allowedTypes})`,
        }),
      ],
    });
    return await filePipe.transform(value); // eslint-disable-line @typescript-eslint/no-unsafe-return
  }
}
