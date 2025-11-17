import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('area_executions')
export class AreaExecution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  areaId: string;

  @Column()
  status: string; // 'success' | 'failed' | 'pending'

  @Column('jsonb', { nullable: true })
  result: any;

  @Column({ nullable: true })
  error: string;

  @CreateDateColumn()
  executedAt: Date;
}
