import { Inject, Injectable, BadRequestException, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { AuditLog } from 'src/entities/audit-log.entity';
import { Logger } from '@gwl/nfrsentry-nj';
import { ErrorType } from '../enums/error-type.enum';

/**
 * Service responsible for handling audit log operations.
 */
@Injectable()
export class AuditLogService {
  private readonly logger = new Logger.Log(AuditLogService.name);
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>) {}

  /**
   * Creates an audit log entry by emitting an event using the PublisherService.
   * @param {CreateAuditLogDto} createAuditLogDto - Data Transfer Object containing audit log details.
   * @returns {Promise<any>} - The result of the emitted event.
   */
  async create(createAuditLogDto) {
    this.logger.enter('create');
    const auditLog = this.auditLogRepository.create(createAuditLogDto);
    this.logger.exit('create');
    return await this.auditLogRepository.save(auditLog);
  }

  /**
   * Handles different types of errors based on the error type provided
   * @param {ErrorType} errorType - Type of error to simulate
   * @returns {Promise<never>} - Throws appropriate error based on the type
   */
  async handleErrors(errorType: ErrorType): Promise<never> {
    this.logger.enter('handleErrors');
    try {
      switch (errorType) {
        case ErrorType.BAD_REQUEST:
          throw new BadRequestException('Invalid request parameters');
        case ErrorType.NOT_FOUND:
          throw new NotFoundException('Requested resource not found');
        case ErrorType.UNAUTHORIZED:
          throw new UnauthorizedException('User is not authorized');
        case ErrorType.INTERNAL:
          throw new InternalServerErrorException('Internal server error occurred');
        default:
          throw new BadRequestException('Unknown error type');
      }
    } catch (error) {
      this.logger.error(`Error in handleErrors: ${error.message}`);
      throw error;
    }
  }
}
