import { lifeTime } from "../constants/lifetimes";
import { injectable } from "../injectable/injectable";

export abstract class Piston{
    abstract tipo: string;
    abstract combustible: string;
    abstract getAttributes(): string;
}

@injectable([], ["TipoX", "Gasolina"], lifeTime.TRANSIENT)
export class PistonImpl implements Piston {
    public id : string;

    constructor(
        public tipo: string,
        public combustible: string) { 

            this.id = Math.random().toString(36).substring(2, 15);
    }

    getAttributes() {
        return `Piston tipo: ${this.id}`;
    }
}
