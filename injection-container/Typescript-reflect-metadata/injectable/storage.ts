import { ServiceLifetime } from "../constants/lifetimes";

export interface MyMetadata {
    deps: any[];
    primitives: any[];
    lifetime: ServiceLifetime;
}
export const MetadataStorage = new Map<any, MyMetadata>();
