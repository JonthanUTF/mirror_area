import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Action } from './action.entity';
import { Reaction } from './reaction.entity';

@Entity('areas')
export class Area {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  enabled: boolean;

  @ManyToOne(() => User, user => user.areas)
  user: User;

  @ManyToOne(() => Action)
  action: Action;

  @Column('jsonb')
  actionParams: Record<string, any>;

  @ManyToOne(() => Reaction)
  reaction: Reaction;

  @Column('jsonb')
  reactionParams: Record<string, any>;

  @Column({ nullable: true })
  lastExecutedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}