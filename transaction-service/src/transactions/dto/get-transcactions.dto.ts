import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

export class GetTransactionsDto {
  @IsUUID()
  user_id: string;

  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @IsString()
  @IsOptional()
  category?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
