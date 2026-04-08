import { injectable } from "../injectable/injectable";

export abstract class Piston{
    abstract tipo: string;
    abstract combustible: string;
    abstract getAttributes(): string;
}

@injectable()
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
