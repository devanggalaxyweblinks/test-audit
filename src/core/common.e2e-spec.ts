import 'dotenv/config';
import { beforeEach, describe, it } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { Config } from '@gwl/nfrsentry-nj';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/account/v1/common/log/level (PUT)', () => {
    const endpoint = '/common/log/level';
    const apisecretkey = Config.AppConfig.get('API_KEY_SECRET');
    return request(app.getHttpServer())
      .put(endpoint)
      .set('apisecretkey', apisecretkey) // Set the API key in the header
      .send({ level: 'debug' }) // Add your CommonDto body parameters here
      .expect(200)
      .expect(
        '{"resData":{"data":null,"message":"Update log level successfully.","status_code":202}}',
      );
  });
});
