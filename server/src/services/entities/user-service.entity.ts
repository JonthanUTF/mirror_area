import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Service } from './service.entity';

@Entity('user_services')
export class UserService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  serviceId: string;

  @ManyToOne(() => Service)
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column('jsonb', { nullable: true })
  credentials: any;

  @Column({ default: false })
  isConnected: boolean;

  @CreateDateColumn()
  connectedAt: Date;
}
