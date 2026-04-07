import { lifeTime, ServiceLifetime } from "../constants/lifetimes";
import { MetadataStorage } from "./storage";


export function injectable(deps: any[] = [], primitives: any[] = [], lifetime: ServiceLifetime = lifeTime.TRANSIENT) {
    return function (constructor: any) {
        MetadataStorage.set(constructor, { deps, primitives, lifetime });
        return constructor;
    };
}


