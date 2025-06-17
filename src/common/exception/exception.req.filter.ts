import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseUtility } from '../utility/response.utility';
import { ErrorCodes } from './error-codes';

/**
 * This class helps to handle request validation using annotations
 * Exception filter for handling BadRequestException.
 */
@Catch(BadRequestException)
export class ExpReqValidateFilter
  implements ExceptionFilter<BadRequestException>
{
  /**
   * Handles the exception and sends a custom response.
   * @param exception - The BadRequestException object.
   * @param host - The ArgumentsHost object.
   * @returns The custom response.
   */
  catch(exception: BadRequestException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    //const request = ctx.getRequest<Request>();
    //const status = exception.getStatus();
    const err = ErrorCodes.BAD_REQUEST_ERROR;
    const error = {
      errorMessage: err.errorMessage,
      statusCode: err.statusCode,
      errorCode: err.errorCode,
      originalMessage: exception.getResponse()['message'],
      source: '',
    };

    const customRes = ResponseUtility.getErrorResponse(error);
    response.json(customRes);
  }
}
