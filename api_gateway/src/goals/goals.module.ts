import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';

@Module({
  imports: [HttpModule],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}
