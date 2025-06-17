import { Config } from '@gwl/nfrsentry-nj';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { AuditLog } from 'src/entities/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return DbConfig.getDbConf();
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
      inject: [],
    }),
  ],
})

/**
 * This class helps to perform all database related operation like database configuration and
 * other require stuff
 *
 * <p>
 * We defined DB related function and variable use it for the project configuration *
 * @author      GWL
 * @since       1.0
 */
export class DbConfig {
  /**
   * Get database configuration value from AppConfig we are fetching data on behalf of
   * key based on property path
   *
   * @returns TypeOrmModuleOptions which helps to set database connectivity
   */
  public static getDbConf(): TypeOrmModuleOptions {
    return {
      type: Config.AppConfig.get('DB.TYPE'),
      host: Config.AppConfig.get('DB.HOST'),
      port: Config.AppConfig.get('DB.PORT')? parseInt(Config.AppConfig.get('DB.PORT')) : 5432,
      username: Config.AppConfig.get('DB.USERNAME'),
      password: Config.AppConfig.get('DB.PASSWORD'),
      database: Config.AppConfig.get('DB.NAME'),
      logging: Config.AppConfig.get('DB.LOGGING') === 'true',
      synchronize: Config.AppConfig.get('DB.SYNCHRONIZE') === 'true',
      logger: 'debug',
      entities: this.getEntity(),
    };
  }

  /**
   * The function returns an array of entity classes.
   * @returns An array of entity classes is being returned.
   */
  public static getEntity() {
    return [
      AuditLog
    ];
  }
}
