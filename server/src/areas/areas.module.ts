import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { Area } from './entities/area.entity';
import { Action } from './entities/action.entity';
import { Reaction } from './entities/reaction.entity';
import { AreaExecution } from './entities/area-execution.entity';
import { HooksModule } from '../hooks/hooks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Area, Action, Reaction, AreaExecution]),
    forwardRef(() => HooksModule),
  ],
  controllers: [AreasController],
  providers: [AreasService],
  exports: [AreasService],
})
export class AreasModule {}
