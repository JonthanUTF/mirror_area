import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateAreaDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  action: {
    serviceId: string;
    actionType: string;
    parameters: any;
  };

  @IsObject()
  actionParams: Record<string, any>;

  @IsObject()
  reaction: {
    serviceId: string;
    reactionType: string;
    parameters: any;
  };

  @IsObject()
  reactionParams: Record<string, any>;
}
