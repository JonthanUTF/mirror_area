import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  async getAllServices() {
    return this.servicesService.getAllServices();
  }

  @Get('user')
  async getUserServices(@Req() req) {
    return this.servicesService.getUserServices(req.user.userId);
  }

  @Post('connect')
  async connectService(@Req() req, @Body() body: { serviceId: string; credentials: any }) {
    return this.servicesService.connectService(req.user.userId, body.serviceId, body.credentials);
  }

  @Delete(':serviceId')
  async disconnectService(@Req() req, @Param('serviceId') serviceId: string) {
    await this.servicesService.disconnectService(req.user.userId, serviceId);
    return { message: 'Service disconnected successfully' };
  }
}
