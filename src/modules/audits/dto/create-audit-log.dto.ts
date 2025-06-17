import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsJSON, IsObject } from 'class-validator';

export class CreateAuditLogDto {
    @ApiProperty()
    @IsUUID()
    @IsOptional()
    orgId?: string;

    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsObject()
    @IsOptional()
    header?: object;

    @ApiProperty()
    @IsObject()
    @IsOptional()
    requestBody?: object;

    @ApiProperty()
    @IsString()
    action: string;

    @ApiProperty()
    @IsString()
    httpUrl: string;

    @ApiProperty()
    @IsString()
    responseCode: string;

    @ApiProperty()
    @IsOptional()
    @IsObject()
    responseBody?: object;

    @ApiProperty()
    @IsString()
    @IsOptional()
    ipAddress?: string;

    @ApiProperty()
    @IsObject()
    @IsOptional()
    logs?: object;

    @ApiProperty()
    @IsString()
    createdBy: string;
}
