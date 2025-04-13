import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GoalsService } from './goals.service';

import { CreateGoalDto } from './dto/create-goal.dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto/update-goal.dto';
import { TransactionEventDto } from './dto/transaction-event.dto/transaction-event.dto';

@Controller('goals')
export class GoalsController {
  private readonly logger = new Logger(GoalsController.name);

  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  async create(@Body() createGoalDto: CreateGoalDto) {
    try {
      return await this.goalsService.create(createGoalDto);
    } catch (error) {
      this.logger.error(`Failed to create goal: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Failed to create goal',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(@Query('user_id') userId: string) {
    try {
      return await this.goalsService.findAll(userId);
    } catch (error) {
      this.logger.error(`Failed to get goals: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Failed to get goals',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.goalsService.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to get goal: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Failed to get goal',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    try {
      return await this.goalsService.update(id, updateGoalDto);
    } catch (error) {
      this.logger.error(`Failed to update goal: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Failed to update goal',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('transaction_created')
  async handleTransactionCreated(@Payload() data: TransactionEventDto) {
    this.logger.log(`Received transaction event: ${JSON.stringify(data)}`);
    return this.goalsService.updateGoalAmountsByTransaction(data);
  }
}
