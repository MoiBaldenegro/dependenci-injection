import { lifeTime } from "../constants/lifetimes";
import { injectable } from "../injectable/injectable";
import { Motor } from "./Motor";

export abstract class Vehicule {
    abstract marca: string;
    abstract modelo: string;
    abstract get(): any;
}

@injectable()
export class VehiculeImpl implements Vehicule {
    constructor(
        public motor: Motor,
        public marca: string,
        public modelo: string,
    ) {
    }

    get() {
        return `Vehiculo: ${this.marca} ${this.modelo}, con motor: ${this.motor.getAttributes()}`;
    }
}


