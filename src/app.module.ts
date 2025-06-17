import { NFRCors } from '@gwl/nfrsentry-nj';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CommonExceptionValidateFilter } from './common/exception/common.exception.filter';
import { ApiKeyAuthenticationMiddleware } from './middleware/apiKeyAuthentication.middleware';
import { TraceInterceptor } from './common/interceptors/tracer.interceptor';
import { AuditLogModule } from './modules/audits/audit-log.module';
import { DbConfig } from 'resources/db.config';
import { CommonModule } from './core/common.module';

/**
 * Main application module for setting up application-wide dependencies, middleware,
 * filters, interceptors, and imported modules.
 */
@Module({
  imports: [
    DbConfig, // Database configuration module
    AuditLogModule, // Module for handling audit logs
    CommonModule, // Common utilities and shared services
  ],
  controllers: [], // No controllers are defined at this level
  providers: [
    {
      provide: APP_FILTER,
      useClass: CommonExceptionValidateFilter, // Global exception filter for validation errors
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TraceInterceptor, // Global interceptor for tracing requests
    },
  ],
})
export class AppModule implements NestModule {
  /**
   * Constructor for AppModule.
   * Initializes services or dependencies as needed.
   */
  constructor() {
    // The scheduler service should be instantiated here if required
  }

  /**
   * Configures middleware for the application.
   * 
   * @param consumer - MiddlewareConsumer to define and apply middleware.
   */
  configure(consumer: MiddlewareConsumer) {
    // Apply Cross-Origin Resource Sharing (CORS) middleware globally
    consumer.apply(NFRCors()).forRoutes('*');

    // Apply API Key authentication middleware globally
    consumer.apply(ApiKeyAuthenticationMiddleware).forRoutes('*');
  }
}
