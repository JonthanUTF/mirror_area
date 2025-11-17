import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class UpdateAreaDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsObject()
  @IsOptional()
  action?: {
    serviceId: string;
    actionType: string;
    parameters: any;
  };

  @IsObject({ each: true })
  @IsOptional()
  reactions?: Array<{
    serviceId: string;
    reactionType: string;
    parameters: any;
    order?: number;
  }>;
}
