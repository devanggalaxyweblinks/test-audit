import { Exception } from '@gwl/nfrsentry-nj';

/**
 * Custom exception class representing application-specific errors.
 *
 * @class
 * @extends {Exception.NFRSentryException}
 */
export class AuditException extends Exception.NFRSentryException {
  /**
   * Creates an instance of AuditException.
   *
   * @constructor
   * @param {Partial<Exception.AppError>} error - Partial error information for the application exception.
   * @param {Exception.ExceptionSource} source - The source of the exception.
   * @param {any} [e] - Additional context or error details.
   */
  constructor(
    error: Partial<Exception.AppError>,
    source: Exception.ExceptionSource,
    e?: any,
  ) {
    super(error, source, e);
    Object.setPrototypeOf(this, AuditException.prototype);
  }
}
