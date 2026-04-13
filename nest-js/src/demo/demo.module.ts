import { Module } from '@nestjs/common';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';

@Module({
  controllers: [DemoController],
  providers: [
    {
      provide: 'DemoService',
      useValue: new DemoService(), 
    },
  ],
})
export class DemoModule {}
