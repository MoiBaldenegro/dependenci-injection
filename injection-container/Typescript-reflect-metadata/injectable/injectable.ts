import { lifeTime, ServiceLifetime } from "../constants/lifetimes";
import "reflect-metadata";

export interface InjectableOptions {
    lifetime?: ServiceLifetime;
    primitives?: any[];        
}



export function injectable(options: InjectableOptions = {}): ClassDecorator {
    return (target: any) => {
        // Guardar metadata de la clase
        Reflect.defineMetadata('injectable:options', options, target);

        // Guardamos el lifetime
        Reflect.defineMetadata('lifetime', options.lifetime || lifeTime.TRANSIENT, target);

        // Guardamos primitivos por defecto (si existen)
        if (options.primitives && options.primitives.length > 0) {
            Reflect.defineMetadata('primitives', options.primitives, target);

           
        }
         // Opcional: también podemos guardar el nombre de la clase
            Reflect.defineMetadata('name', target.name, target);
    }
}


