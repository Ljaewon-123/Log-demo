import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  // NestJS Logger를 사용하면 main.ts에서 설정한 winston과 자동으로 연결됩니다.
  private readonly logger = new Logger(TaskService.name);

  // 10초마다 실행되는 크론잡
  @Cron('*/10 * * * * *')
  handleCron() {
    this.logger.log('10초마다 발생하는 스케줄러 로그입니다.');
  }

  // 에러 로그
  @Cron('*/20 * * * * *')
  handleErrorCron() {
    this.logger.error('20초마다 발생하는 에러 로그 테스트입니다!');
  }
}