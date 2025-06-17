import { Module } from '@nestjs/common';
import { CommonController } from '../core/common.controller';

@Module({
  controllers: [CommonController],
  providers: [],
})
export class CommonModule {}
