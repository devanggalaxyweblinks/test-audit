import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ResponseUtility } from '../utility/response.utility';
import { Exception } from '@gwl/nfrsentry-nj';
/**
 * Exception filter class helps to handle and format exceptions of type NFRSentryException.
 */
@Catch(Exception.NFRSentryException)
export class CommonExceptionValidateFilter
  implements ExceptionFilter<Exception.NFRSentryException>
{
  /**
   * Catches the specified NFRSentryException and transforms it into a formatted error response.
   * @param exception The caught NFRSentryException instance.
   * @param host The ArgumentsHost object representing the execution context.
   * @returns The formatted error response based on the provided exception.
   */
  catch(exception: Exception.NFRSentryException, host: ArgumentsHost): any {
    // Extracting the HTTP context from the ArgumentsHost
    const ctx = host.switchToHttp();
    // Getting the HTTP response object
    const response = ctx.getResponse<Response>();
    // Creating a custom error response based on the caught exception
    const customRes = ResponseUtility.getErrorResponse(exception);
    // Sending the formatted error response as JSON
    response.json(customRes);
  }
}
