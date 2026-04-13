import { Controller, Get, Inject } from '@nestjs/common';
import { DemoService } from './demo.service';

@Controller('demo')
export class DemoController {
  constructor(@Inject('DemoService') private demoService: DemoService) {}

  @Get('vehicule')
  async getVehicule() {
    const vehicule = await this.demoService.getItem();
    return vehicule;
  }
}
