import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('reactions')
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  serviceId: string;

  @Column()
  reactionType: string;

  @Column('jsonb')
  parameters: any;

  @CreateDateColumn()
  createdAt: Date;
}
