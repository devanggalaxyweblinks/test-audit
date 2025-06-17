import { INestApplication } from '@nestjs/common';
import { Logger, NFRLogger } from '@gwl/nfrsentry-nj';

/**
 *
 * This class helps to set the all nest factory configuration
 * <p>
 * This can we use this object on all our project and files*
 * @author      GWL
 * @version     %I%, %G%
 * @since       1.0
 */
export class Application {
  /**
   * Static variable holds interface INestApplication
   */
  private static app: INestApplication;

  /**
   * This method helps to set nest js factory object
   *
   * @param app contain NestJS factory object
   */
  static setApp(app: INestApplication): any {
    this.app = app;
  }

  /**
   * This method helps to set auto validation pips
   *
   */
  static addEnhancement(): any {
    // Commenting to remove lint error
  }
  /**
   * This method help to get project configuration which is mentioned in yaml,
   * JSON and .env file
   *
   * @param tInput contain string key which set in yaml ,json and .evn file
   * @returns key value for the project configuration
   */
  static applyCustomLogger(logger?: any): any {
    if (!logger) {
      logger = new Logger.Log('audit-service project');
    }
    NFRLogger.setLogger(logger);
    return logger;
  }

  /*static setConf(configService: ConfigService) {
    this.confService = configService;
  }*/
}
