import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GoalsService {
  private readonly logger = new Logger(GoalsService.name);
  constructor(private readonly httpService: HttpService) {}

  private readonly goalServiceBaseUrl = 'http://localhost:3003/goals';

  async create(createGoalDto: any) {
    this.logger.log(`Creating goal: ${JSON.stringify(createGoalDto)}`);
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(this.goalServiceBaseUrl, createGoalDto),
      );
      return data;
    } catch (error) {
      this.logger.error(`Error creating goal: ${error.message}`);
      throw error;
    }
  }

  async findAll(userId: string) {
    this.logger.log(`Getting goals for user: ${userId}`);
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(this.goalServiceBaseUrl, {
          params: { user_id: userId },
        }),
      );
      return data;
    } catch (error) {
      this.logger.error(`Error getting goals: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string) {
    this.logger.log(`Getting goal with id: ${id}`);
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.goalServiceBaseUrl}/${id}`),
      );
      return data;
    } catch (error) {
      this.logger.error(`Error getting goal: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateGoalDto: any) {
    this.logger.log(`Updating goal ${id}: ${JSON.stringify(updateGoalDto)}`);
    try {
      const { data } = await firstValueFrom(
        this.httpService.put(`${this.goalServiceBaseUrl}/${id}`, updateGoalDto),
      );
      return data;
    } catch (error) {
      this.logger.error(`Error updating goal: ${error.message}`);
      throw error;
    }
  }
}
