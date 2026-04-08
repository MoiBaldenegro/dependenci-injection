import { lifeTime, ServiceLifetime } from "./constants/lifetimes";
import { Context, ServiceProvider } from "./types/serviceProvider";
import 'reflect-metadata';


    
export class VehiculeServiceProvider implements ServiceProvider {
    private _services = new Map<any, any>();
    private _instances = new Map<any, any>();
    private lifetimes = new Map<any, ServiceLifetime>(); 
    private primitives = new Map<any, any[]>();

   
    createScope(){
        const context = new Map<any, any>();

        return {
            get: <T>(token: any): T => this.getService(token, context),
            destroy: () => context.clear()
        };
    }

    register(
        token: any,
        implementation: any,
        options: { 
            lifetime?: ServiceLifetime; 
            primitives?: any[] 
        } = {}
    ): void {
        this._services.set(token, implementation);

        const lifetimeFromDecorator = Reflect.getMetadata('lifetime', implementation);
        const primitivesFromDecorator = Reflect.getMetadata('primitives', implementation) || [];

        const finalLifetime = options.lifetime ?? lifetimeFromDecorator ?? lifeTime.TRANSIENT;
        this.lifetimes.set(token, finalLifetime);

        // Primitivos: opciones manuales tienen prioridad sobre el decorador
        const finalPrimitives = options.primitives?.length 
            ? options.primitives 
            : primitivesFromDecorator;

            if (finalPrimitives.length > 0) {
                this.primitives.set(token, finalPrimitives);
        }  
    }

    getService<T>(token: any, context?: Context ): T {

        // 1. Verificar si ya existe como Singleton
        if (this.lifetimes.get(token) === lifeTime.SINGLETON && this._instances.has(token)) {
            return this._instances.get(token);
        }

        // 2. Verificar si existe en el scope actual (Scoped)
        if (this.lifetimes.get(token) === lifeTime.SCOPED && context?.has(token)) {
            return context.get(token);
        }

        // AQUI TRAEMOS LA CLASE PARA USARLA
        const ImplClass = this._services.get(token);

        if (!ImplClass) throw new Error(`Token no registrado: ${token.name}`);

        // === RESOLUCIÓN AUTOMÁTICA DE DEPENDENCIAS ===
        // AQQUI USAMOS REFLECT-METADATA PARA OBTENER LOS TIPOS DE LOS PARÁMETROS DEL CONSTRUCTOR
        const paramTypes = Reflect.getMetadata('design:paramtypes', ImplClass) || [];
        console.log(`Resolviendo ${token.name} con dependencias:`, paramTypes.map((t: any) => t.name));

        const resolvedDependencies = paramTypes.map((depToken: any) => {
            if (depToken === token) {
                throw new Error(`[CIRCULAR DEPENDENCY]: Circular dependency detected for: ${token.name}`);
            }
            return this.getService(depToken, context);
        });

        // Primitivos (si los tiene configurados)
        const defaultPrimitives = this.primitives.get(token) || [];
        const allArgs = [...resolvedDependencies, ...defaultPrimitives];

        // Crear instancia
        const instance = Reflect.construct(ImplClass, allArgs) as T;


        // Guardar según Lifetime
        if (this.lifetimes.get(token) === lifeTime.SINGLETON) {
            this._instances.set(token, instance);
        } else if (this.lifetimes.get(token) === lifeTime.SCOPED && context) {
            context.set(token, instance);
        }

        return instance;
    }
}