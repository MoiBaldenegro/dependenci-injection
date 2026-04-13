import { Injectable } from '@nestjs/common';
import { getVehicule } from './lib/vehicule-repository';

@Injectable()
export class DemoService {
  constructor() {}

  async getItem() {
    // Llamamos a la función getVehicule del repositorio para obtener un vehículo
    // estgo podria ser una llamada a una base de datos o a un servicio externo en un caso real
    const response = getVehicule();
    return response;
  }
}
