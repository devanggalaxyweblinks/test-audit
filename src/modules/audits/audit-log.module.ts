import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogService } from './services/audit-log.service';
import { AuditLogController } from './controllers/audit-log.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Config } from '@gwl/nfrsentry-nj';
import { AuditLog } from 'src/entities/audit-log.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AuditLog]),
    // ClientsModule.register([
    //     {
    //       name: 'AUDIT_LOG_SERVICE', // Identifier for the client
    //       transport: Transport.RMQ,
    //       options: {
    //       urls: [Config.AppConfig.get('RABBITMQ_URL') || 'amqp://localhost:5672'],
    //       queue: Config.AppConfig.get('RABBITMQ_AUDIT_LOG_QUEUE'),
    //       queueOptions: {
    //         durable: true, // Make the queue durable
    //       },
    //       },
    //     },
    //   ]),
    ],
    controllers: [AuditLogController],
    providers: [AuditLogService],
})
export class AuditLogModule {}
