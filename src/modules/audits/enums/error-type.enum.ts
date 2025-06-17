import { ApiProperty } from '@nestjs/swagger';

export enum ErrorType {
    BAD_REQUEST = 'badrequest',
    NOT_FOUND = 'notfound',
    UNAUTHORIZED = 'unauthorized',
    INTERNAL = 'internal'
} 