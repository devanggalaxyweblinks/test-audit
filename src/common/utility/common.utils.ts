import { Exception } from '@gwl/nfrsentry-nj';
import { AuditException } from '../exception/audit.exception';
/**
 * This class helps to contains all common useful method which we can use
 * in any where
 */
export class CommonUtils {
  /**
   * This method helps to throw custom exception
   * @param errorObj contains user defined error code and messages
   * @param e contains error object
   * @param logger contains logger obj
   */
  public static throwException(errorObj: any, e?: any): any {
    throw new AuditException(errorObj, e);
  }

  /**
   * This method helps to throw new user defined exception
   * @param errorObj contains user defined error code and messages
   * @param logger contains logger obj
   */
  public static throwNewException(errorObj: any, logger?: any): any {
    const source = logger
      ? new Exception.ExceptionSource(
          logger?.getClassName(),
          logger?.getMethodName(),
        )
      : null;
    throw new AuditException(errorObj, source);
  }
}
