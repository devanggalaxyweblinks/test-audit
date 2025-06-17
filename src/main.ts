import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Config } from '@gwl/nfrsentry-nj';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from './app.module';
import { Application } from './application';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import './common/utility/tracer';

/**
 * This main.ts includes an async function, which will bootstrap our application/create a Nest application instance
 */
async function bootstrap(): Promise<void> {
  initializeTransactionalContext();

  // Create the primary HTTP Nest application
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: Application.applyCustomLogger(),
    abortOnError: true, // for transactional
  });

  app.setGlobalPrefix('/api/audit/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  /**
   * Configures the Swagger API documentation for CRUD Operations.
   * @class
   */
  const config = new DocumentBuilder()
    .setTitle('Audit')
    .setDescription('The Audit Service')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'accessToken',
    )
    .addApiKey(
      { type: 'apiKey', name: 'apiSecretKey', in: 'header' },
      'apiSecretKey',
    )
    .setVersion('1.0')
    .addTag('APIs list')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/audit', app, document);

  // Serve static Compodoc documentation if available
  const documentationPath = join(process.cwd(), 'documentation');
  app.useStaticAssets(documentationPath, {
    prefix: '/api/compodoc/',
  });

  // Set up and start the RabbitMQ microservice
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [Config.AppConfig.get('RABBITMQ_URL') || 'amqp://localhost:5672'],
  //     queue: Config.AppConfig.get('RABBITMQ_AUDIT_LOG_QUEUE'),
  //     queueOptions: {
  //       durable: true, // Make the queue durable
  //     },
  //   },
  // });

  // Start both HTTP and RabbitMQ services
  const PORT = Config.AppConfig.get('SERVER.PORT');
  await app.startAllMicroservices();
  await app.listen(PORT);

  console.warn(`Application running on port:: ${PORT}`);
}
bootstrap();
