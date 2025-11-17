import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('actions')
export class Action {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  serviceId: string;

  @Column()
  actionType: string;

  @Column('jsonb')
  parameters: any;

  @CreateDateColumn()
  createdAt: Date;
}
