import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
/**
 * This class helps to set Data Transfer Objects for Log.
 */
export class CommonDto {
  /**
   * variable level holds type string.
   */
  @ApiProperty({
    description: 'Loglevel',
    type: String,
    example: 'debug',
  })
  @IsNotEmpty()
  @IsString()
  level: string;
}
