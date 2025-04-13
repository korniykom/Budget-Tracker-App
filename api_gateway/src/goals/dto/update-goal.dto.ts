import {
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';

export enum GoalStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class UpdateGoalDto {
  @IsOptional()
  @IsString()
  goal_name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  target_amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  current_amount?: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsEnum(GoalStatus)
  status?: GoalStatus;
}
