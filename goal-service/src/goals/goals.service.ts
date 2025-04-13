import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Goal, GoalStatus } from './entities/goal.entity/goal.entity';
import { CreateGoalDto } from './dto/create-goal.dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto/update-goal.dto';
import { TransactionEventDto } from './dto/transaction-event.dto/transaction-event.dto';

@Injectable()
export class GoalsService {
  private readonly logger = new Logger(GoalsService.name);

  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionClient: ClientProxy,
  ) {}

  async create(createGoalDto: CreateGoalDto): Promise<Goal> {
    const goal = this.goalRepository.create({
      ...createGoalDto,
      deadline: new Date(createGoalDto.deadline),
      current_amount: 0,
      status: GoalStatus.IN_PROGRESS,
    });

    return this.goalRepository.save(goal);
  }

  async findAll(userId: string): Promise<Goal[]> {
    return this.goalRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Goal> {
    const goal = await this.goalRepository.findOne({ where: { id } });
    if (!goal) {
      throw new NotFoundException(`Goal with ID "${id}" not found`);
    }
    return goal;
  }

  async update(id: string, updateGoalDto: UpdateGoalDto): Promise<Goal> {
    const goal = await this.findOne(id);

    Object.assign(goal, updateGoalDto);

    this.checkAndUpdateGoalStatus(goal);

    return this.goalRepository.save(goal);
  }

  async updateGoalAmountsByTransaction(
    transaction: TransactionEventDto,
  ): Promise<void> {
    this.logger.log(
      `Updating goals for user: ${transaction.user_id} based on transaction: ${transaction.id}`,
    );

    const activeGoals = await this.goalRepository.find({
      where: {
        user_id: transaction.user_id,
        status: GoalStatus.IN_PROGRESS,
      },
    });

    if (activeGoals.length === 0) {
      this.logger.log(`No active goals found for user: ${transaction.user_id}`);
      return;
    }

    for (const goal of activeGoals) {
      if (transaction.type === 'income') {
        goal.current_amount += transaction.amount;
      }

      this.checkAndUpdateGoalStatus(goal);

      await this.goalRepository.save(goal);
      this.logger.log(
        `Updated goal ${goal.id} for user: ${transaction.user_id}, new amount: ${goal.current_amount}`,
      );
    }
  }

  private checkAndUpdateGoalStatus(goal: Goal): void {
    const now = new Date();

    if (goal.current_amount >= goal.target_amount) {
      goal.status = GoalStatus.COMPLETED;
    } else if (goal.deadline < now && goal.status === GoalStatus.IN_PROGRESS) {
      goal.status = GoalStatus.FAILED;
    }
  }
}
