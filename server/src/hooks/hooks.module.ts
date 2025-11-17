import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { HooksService } from './hooks.service';
import { SchedulerService } from './scheduler.service';
import { HookProcessor } from './processors/hook.processor';
import { Area } from '../areas/entities/area.entity';
import { AreasModule } from '../areas/areas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Area]),
    BullModule.registerQueue({
      name: 'hooks',
    }),
    forwardRef(() => AreasModule),
  ],
  providers: [HooksService, SchedulerService, HookProcessor],
  exports: [HooksService],
})
export class HooksModule {}
