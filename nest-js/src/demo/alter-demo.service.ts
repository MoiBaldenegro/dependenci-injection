import { Injectable } from '@nestjs/common';
import { Vehicule } from './types/vehicule';

@Injectable()
export class AlterDemoService {
  constructor() {}

  private vehicule: Vehicule = {
    name: 'Tesla',
    model: 'Model S',
    year: 2020,
  };

  getItem(): Vehicule {
    console.log(
      'Este es un vehiculo retornado desde el servicio AlterDemoService',
    );
    return this.vehicule;
  }
}
