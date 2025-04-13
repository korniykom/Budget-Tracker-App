import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateGoalDto {
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  goal_name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  target_amount: number;

  @IsNotEmpty()
  @IsDateString()
  deadline: string;
}
