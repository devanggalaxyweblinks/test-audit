import { Controller, Post, Body, Res, HttpCode, Param, Query } from '@nestjs/common';
import { AuditLogService } from '../services/audit-log.service';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { Config, Logger } from '@gwl/nfrsentry-nj';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ErrorType } from '../enums/error-type.enum';

@ApiTags('audit-logs')
@Controller('audit-logs')
@ApiSecurity('apiSecretKey')
export class AuditLogController {
    // Create a logger instance for logging method entries and exits.
    private readonly logger = new Logger.Log(AuditLogController.name);
    constructor(private readonly auditLogService: AuditLogService) {}

    @EventPattern(Config.AppConfig.get('RABBITMQ_QUEUE_NAME'))
    async handleAuditLogCreated(@Payload() data: any, @Ctx() context: RmqContext) {
        this.logger.enter('handleAuditLogCreated');
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();
        channel.ack(originalMessage); // Acknowledge the message
    
        const auditLog = await this.auditLogService.create(data);
        this.logger.exit('handleAuditLogCreated');
        return auditLog;
    }

    @Post('test-error')
    @HttpCode(200)
    @ApiOperation({ summary: 'Test different types of errors' })
    @ApiResponse({ status: 400, description: 'Bad Request Error' })
    @ApiResponse({ status: 401, description: 'Unauthorized Error' })
    @ApiResponse({ status: 404, description: 'Not Found Error' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiQuery({
        name: 'errorType',
        enum: ErrorType,
        enumName: 'ErrorType',
        description: 'Type of error to simulate'
    })
    async testError(
        @Query('errorType') errorType: ErrorType,
    ) {
        this.logger.enter('testError');
        console.log(errorType);
        await this.auditLogService.handleErrors(errorType);
        this.logger.exit('testError');
    }
}
