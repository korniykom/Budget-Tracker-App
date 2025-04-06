import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TransactionsService {
  constructor(private readonly httpService: HttpService) {}

  private readonly transactionServiceBaseUrl =
    'http://localhost:3002/transactions';

  async create(createTransactionDto: any) {
    const { data } = await firstValueFrom(
      this.httpService.post(
        this.transactionServiceBaseUrl,
        createTransactionDto,
      ),
    );
    return data;
  }

  async findAll(userId: string, params: any) {
    const { data } = await firstValueFrom(
      this.httpService.get(this.transactionServiceBaseUrl, {
        params: { user_id: userId, ...params },
      }),
    );
    return data;
  }

  async findOne(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.transactionServiceBaseUrl}/${id}`),
    );
    return data;
  }

  async getSummary(userId: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${this.transactionServiceBaseUrl}/${userId}/summary`,
      ),
    );
    return data;
  }

  async remove(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.delete(`${this.transactionServiceBaseUrl}/${id}`),
    );
    return data;
  }
}
