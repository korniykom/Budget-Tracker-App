import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsDto } from './dto/get-transcactions.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @Inject('RABBITMQ_SERVICE')
    private client: ClientProxy,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      transaction_date: new Date(createTransactionDto.transaction_date),
    });

    const savedTransaction =
      await this.transactionsRepository.save(transaction);

    this.client.emit('transaction_created', savedTransaction);

    return savedTransaction;
  }

  async findAll(params: GetTransactionsDto): Promise<Transaction[]> {
    const {
      user_id,
      type,
      category,
      startDate,
      endDate,
      sortBy = 'transaction_date',
      sortOrder = 'DESC',
    } = params;

    const where: FindOptionsWhere<Transaction> = { user_id };

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = category;
    }

    if (startDate && endDate) {
      where.transaction_date = Between(new Date(startDate), new Date(endDate));
    }

    return this.transactionsRepository.find({
      where,
      order: {
        [sortBy]: sortOrder,
      },
    });
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async getSummary(
    userId: string,
  ): Promise<{ income: number; expense: number; balance: number }> {
    const income = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.type = :type', { type: TransactionType.INCOME })
      .select('SUM(transaction.amount)', 'total')
      .getRawOne();

    const expense = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.type = :type', { type: TransactionType.EXPENSE })
      .select('SUM(transaction.amount)', 'total')
      .getRawOne();

    const totalIncome = income.total ? parseFloat(income.total) : 0;
    const totalExpense = expense.total ? parseFloat(expense.total) : 0;

    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
    };
  }

  async remove(id: string): Promise<void> {
    const transaction = await this.findOne(id);
    await this.transactionsRepository.remove(transaction);

    this.client.emit('transaction_deleted', {
      id,
      user_id: transaction.user_id,
    });
  }
}
