import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiKeyAuthentication, Exception } from '@gwl/nfrsentry-nj';
import { ErrorCodes } from '../common/exception/error-codes';
import { AuditException } from '../common/exception/audit.exception';

@Injectable()
/**
 * ApiKeyAuthenticationMiddleware class responsible for handling API Key authentication in NestJS.
 * @class
 */
export class ApiKeyAuthenticationMiddleware implements NestMiddleware {
  /**
   * Middleware function to handle API Key authentication.
   * @function
   * @name use
   * @param {Request} req - The incoming request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next function to call in the middleware chain.
   * @throws {AuditException} Throws a AuditException if there's an authentication error.
   */
  use(req: Request, res: Response, next: NextFunction) {
    // Extract the API secret key from the request header
    const apiSecretKey = this.extractSecretKeyFromHeader(req);
    try {
      // Validate the API Key using ApiKeyAuthentication
      ApiKeyAuthentication.validateApiKey(apiSecretKey);
      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      // Handle authentication errors
      if (error instanceof AuditException) {
        // Rethrow AuditException
        throw error;
      } else {
        // Create and throw a AuditException for other errors
        throw AuditException.create(
          ErrorCodes.BAD_REQUEST_API_SECRET_KEY_ERROR,
          new Exception.ExceptionSource(
            this.constructor.name,
            'ApiKeyAuthenticationMiddleware',
          ),
          error,
        );
      }
    }
  }
  /**
   * Extracts the API secret key from the request header.
   * @private
   * @function
   * @name extractSecretKeyFromHeader
   * @param {Request} request - The incoming request object.
   * @returns {string | undefined} - The extracted API secret key from headers.
   */
  private extractSecretKeyFromHeader(request: Request): string | undefined {
    // Implementation to extract the API secret key from the request header
    const apiSecretKey: any =
      request?.headers?.apisecretkey ?? request?.headers?.apiSecretKey ?? '';
    // Return the extracted API secret key
    return apiSecretKey;
  }
}
