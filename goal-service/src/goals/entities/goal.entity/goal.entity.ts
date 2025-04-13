import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum GoalStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column()
  goal_name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  target_amount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  current_amount: number;

  @Column({ type: 'timestamp' })
  deadline: Date;

  @Column({
    type: 'enum',
    enum: GoalStatus,
    default: GoalStatus.IN_PROGRESS,
  })
  status: GoalStatus;

  @CreateDateColumn()
  created_at: Date;
}
