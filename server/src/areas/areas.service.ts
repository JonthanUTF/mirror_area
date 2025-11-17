import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from './entities/area.entity';
import { Action } from './entities/action.entity';
import { Reaction } from './entities/reaction.entity';
import { CreateAreaDto } from './dto/create-area.dto';
import { HooksService } from '../hooks/hooks.service';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area)
    private areasRepository: Repository<Area>,
    @InjectRepository(Action)
    private actionsRepository: Repository<Action>,
    @InjectRepository(Reaction)
    private reactionsRepository: Repository<Reaction>,
    private hooksService: HooksService,
  ) {}

  async create(userId: string, createAreaDto: CreateAreaDto): Promise<Area> {
    // Create Action entity
    const action = this.actionsRepository.create({
      serviceId: createAreaDto.action.serviceId,
      actionType: createAreaDto.action.actionType,
      parameters: createAreaDto.action.parameters,
    });
    const savedAction = await this.actionsRepository.save(action);

    // Create Reaction entity
    const reaction = this.reactionsRepository.create({
      serviceId: createAreaDto.reaction.serviceId,
      reactionType: createAreaDto.reaction.reactionType,
      parameters: createAreaDto.reaction.parameters,
    });
    const savedReaction = await this.reactionsRepository.save(reaction);

    // Create Area
    const area = this.areasRepository.create({
      name: createAreaDto.name,
      description: createAreaDto.description,
      user: { id: userId },
      action: savedAction,
      actionParams: createAreaDto.actionParams,
      reaction: savedReaction,
      reactionParams: createAreaDto.reactionParams,
    });

    const savedArea = await this.areasRepository.save(area);
    
    // Schedule the hook
    await this.hooksService.scheduleHook(savedArea.id);
    
    return savedArea;
  }

  async findAllByUser(userId: string): Promise<Area[]> {
    return this.areasRepository.find({
      where: { user: { id: userId } },
      relations: ['action', 'reaction'],
    });
  }

  async findOne(id: string): Promise<Area> {
    const area = await this.areasRepository.findOne({
      where: { id },
      relations: ['action', 'reaction'],
    });

    if (!area) {
      throw new NotFoundException(`Area #${id} not found`);
    }

    return area;
  }

  async toggleEnabled(id: string): Promise<Area> {
    const area = await this.findOne(id);
    area.enabled = !area.enabled;
    return this.areasRepository.save(area);
  }

  async remove(id: string): Promise<void> {
    await this.areasRepository.delete(id);
  }
}