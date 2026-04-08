type Constructor<T> = new (...args: any[]) => T;
type AbstractConstructor<T> = abstract new (...args: any[]) => T;
export type Context = Map<any, any>;

export interface ServiceProvider{
    createScope(): { get: <T>(token: any, ) => T; destroy: () => void };
    register<T, A extends Constructor<T>>(tk: AbstractConstructor<T>, dependency: A, config?: {
            deps?: AbstractConstructor<any>[];
            primitives?: any[];
        }): void;
    getService<T>(token: Constructor<T>, context: Context): T;

}