import {
  EMPTY_ACCESS_TOKEN_ERROR,
  UNAUTHORIZED_ACCESS_TOKEN_ERROR,
  BAD_REQUEST_API_SECRET_KEY_ERROR,
  BAD_REQUEST_ERROR
} from '../../../message/error.messages';
import { Exception, HttpStatusCode } from '@gwl/nfrsentry-nj';

/**
 * This class helps to get the error code , status, and message
 */
export const ErrorCodes = {
  EMPTY_ACCESS_TOKEN_ERROR: new Exception.AppError(
    'AU-5002',
    HttpStatusCode.UNAUTHORIZED,
    EMPTY_ACCESS_TOKEN_ERROR,
  ),
  UNAUTHORIZED_ACCESS_TOKEN_ERROR: new Exception.AppError(
    'AU-5003',
    HttpStatusCode.UNAUTHORIZED,
    UNAUTHORIZED_ACCESS_TOKEN_ERROR,
  ),
  BAD_REQUEST_API_SECRET_KEY_ERROR: new Exception.AppError(
    'AU-5004',
    HttpStatusCode.BAD_REQUEST,
    BAD_REQUEST_API_SECRET_KEY_ERROR,
  ),
  BAD_REQUEST_ERROR: new Exception.AppError(
    'AU-5005',
    HttpStatusCode.BAD_REQUEST,
    BAD_REQUEST_ERROR,
  )
};
