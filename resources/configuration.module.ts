import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      //load: [AppConfig.loadData] ,
      isGlobal: true,
    }),
  ],
  providers: [ConfigService],
})
export class ConfigurationModule {
}
