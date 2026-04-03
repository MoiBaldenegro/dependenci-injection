interface ServiceProvider{
    register<T, A extends T>(tk: string, dependency: A): void;
    getService<T>(tk: string): T;
}

interface Carro {
    marca: string;
}

interface Avion {
    bench: string;
    modelo: string;
    capacidad: number;
}

class CarroImpl implements Carro {
    constructor(
          public marca: string,
        public modelo: string
    ){}

    get(){
        return {
            marca: this.marca,
            modelo: this.modelo
        }
    }
}

class AvionImpl implements Avion {

    constructor(
          public bench: string,
            public modelo: string,
            public capacidad: number
    ){}

    get(){
        return {
            bench: this.bench,
            modelo: this.modelo,
            capacidad: this.capacidad
        }
    }
}


class VehiculoServiceProvider implements ServiceProvider {
    constructor(
        private _services: Map<string, any> = new Map()
    ){}
    register<T, A extends T>(tk: string, dependency: A): void {
        this._services.set(tk, dependency);
    }

    getService<T>(tk: string): T {            {
        return this._services.get(tk);
    }

    }
}

const service = new VehiculoServiceProvider();
service.register<Carro>("CARRO", CarroImpl);