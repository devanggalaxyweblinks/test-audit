import { Logger } from '@gwl/nfrsentry-nj';
import { Controller } from '@nestjs/common';
import {
  ApiTags,
} from '@nestjs/swagger';
/**
 *
 * This class helps to set common routes and perform logger related api operation.
 */
@ApiTags('Log')
@Controller('common')
export class CommonController {
  private readonly logger = new Logger.Log(CommonController.name);

}
