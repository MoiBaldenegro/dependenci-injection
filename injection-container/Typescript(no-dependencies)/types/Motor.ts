import { lifeTime } from "../constants/lifetimes";
import { injectable } from "../injectable/injectable";
import { Piston } from "./Piston";

export abstract class Motor {
    abstract tipo: string;
    abstract combustible: string;
    abstract piston : Piston;
    abstract getAttributes(): string;
}

@injectable([Piston], ["V6", "Diesel"], lifeTime.SCOPED)
export class MotorImpl implements Motor {
    id : string;
    constructor(
        public piston: Piston,
        public tipo: string,
        public combustible: string,
        ) { 
            this.id = Math.random().toString(36).substring(2, 15);
    }

    getAttributes() {
        return `Motor numero: ${this.id}, ${this.piston.getAttributes()}`;
    }
}
