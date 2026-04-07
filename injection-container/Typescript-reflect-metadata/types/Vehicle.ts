import { lifeTime } from "../constants/lifetimes";
import { injectable } from "../injectable/injectable";
import { Motor } from "./Motor";

export abstract class Vehicule {
    abstract marca: string;
    abstract modelo: string;
    abstract get(): any;
}

@injectable([Motor], ["Toyota", "Corolla"], lifeTime.TRANSIENT)
export class VehiculeImpl implements Vehicule {
    constructor(
        public motor: Motor,
        public marca: string,
        public modelo: string,
    ) {
    }

    get() {
        return "soy un carro: " + this.motor.getAttributes();
    }
}


