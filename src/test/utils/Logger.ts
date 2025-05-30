import winston from 'winston';

const Logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf((info) => `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`),
      ),
    }),
    new winston.transports.File({
      filename: 'test-results/logs/execution.log',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf((info) => `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`),
      ),
    }),
  ],
});

const TEST_SEPARATOR = '----------------------------------------------------------------------';

export default class Log {
  public static testBegin(scenario: string): void {
    this.printLogs(`Scenario: ${scenario} - Started`, TEST_SEPARATOR);
  }

  public static testEnd(scenario: string, status: string): void {
    this.printLogs(`Scenario: ${scenario} - ${status}`, TEST_SEPARATOR);
  }

  public static testSeparator(): void {
    Logger.info(TEST_SEPARATOR);
  }

  private static printLogs(msg: string, separator: string): void {
    Logger.info(separator);
    Logger.info(msg.toUpperCase());
    Logger.info(separator);
  }

  public static info(message: string): void {
    Logger.info(message);
  }

  public static warn(message: string): void {
    Logger.warn(message);
  }

  public static error(error: string): void {
    Logger.error(error);
  }
}
