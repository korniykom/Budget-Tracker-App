import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);

  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() createTransactionDto: any) {
    try {
      return await this.transactionsService.create(createTransactionDto);
    } catch (error) {
      this.logger.error(`Failed to create transaction: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Failed to create transaction',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(@Query('user_id') userId: string, @Query() query: any) {
    try {
      return await this.transactionsService.findAll(userId, query);
    } catch (error) {
      this.logger.error(`Failed to get transactions: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Failed to get transactions',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.transactionsService.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to get transaction: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Failed to get transaction',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':userId/summary')
  async getSummary(@Param('userId') userId: string) {
    try {
      return await this.transactionsService.getSummary(userId);
    } catch (error) {
      this.logger.error(`Failed to get summary: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Failed to get summary',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.transactionsService.remove(id);
    } catch (error) {
      this.logger.error(`Failed to delete transaction: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Failed to delete transaction',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
