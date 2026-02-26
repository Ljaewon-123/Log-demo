import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // NestJS의 기본 로거를 Winston으로 교체
    logger: WinstonModule.createLogger({
      transports: [
        // 1. 터미널 콘솔 출력
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `${timestamp} [${level}] ${context ? `[${context}] ` : ''}${message}`;
            }),
          ),
        }),
        // 2. 파일 출력 (Filebeat가 읽을 JSON 로그)
        new DailyRotateFile({
          dirname: 'logs',
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(), // ELK 연동을 위해 JSON 포맷 권장
          ),
        }),
        new winston.transports.Http({
          host: 'localhost',
          port: 5044,
          path: '/',
          format: winston.format.json()
        })
      ],
    }),
  });
  await app.listen(3000);
}
bootstrap();