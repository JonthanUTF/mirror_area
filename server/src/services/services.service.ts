import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { UserService } from './entities/user-service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(UserService)
    private userServicesRepository: Repository<UserService>,
  ) {}

  async getAllServices(): Promise<Service[]> {
    return this.servicesRepository.find();
  }

  async getUserServices(userId: string): Promise<UserService[]> {
    return this.userServicesRepository.find({
      where: { userId },
      relations: ['service'],
    });
  }

  async connectService(userId: string, serviceId: string, credentials: any): Promise<UserService> {
    const userService = this.userServicesRepository.create({
      userId,
      serviceId,
      credentials,
      isConnected: true,
    });
    return this.userServicesRepository.save(userService);
  }

  async disconnectService(userId: string, serviceId: string): Promise<void> {
    await this.userServicesRepository.delete({ userId, serviceId });
  }
}
