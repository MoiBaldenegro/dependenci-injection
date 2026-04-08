import { lifeTime, ServiceLifetime } from "./constants/lifetimes";
import { Context, ServiceProvider } from "./types/serviceProvider";
import 'reflect-metadata';

  
export class VehiculeServiceProvider implements ServiceProvider {
    private _services = new Map<any, any>();
    private _instances = new Map<any, any>();
    private lifetimes = new Map<any, ServiceLifetime>(); 
    // Estos son los valores reales, no los tipos;
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
            // estos son los valores reales para instanciar
            primitives?: any[] 
        } = {}
    ): void {
        // guardamos la clase constructora con su token
        // en este caso el roken es la clase abstracta
        this._services.set(token, implementation);

        // aqui buscamos si ya esta implementacion tiene injectado el lifetime
        // si es asi, lo recuperamos
        const lifetimeFromDecorator = Reflect.getMetadata('lifetime', implementation);

        // aqui buscamos si ya esta implementacion tiene injectados los primitivos
        // si es asi, lo recuperamos
        const primitivesFromDecorator = Reflect.getMetadata('primitives', implementation) || [];

        // si me mandan le life time ese le pongo, si no le pongo lo que encontre en el decorador, y si no hay nada le pongo TRANSIENT por defecto
        const finalLifetime = options.lifetime ?? lifetimeFromDecorator ?? lifeTime.TRANSIENT;
        this.lifetimes.set(token, finalLifetime);

        // Primitivos: opciones manuales tienen prioridad sobre el decorador
        const finalPrimitives = options.primitives?.length 
            ? options.primitives 
            : primitivesFromDecorator;

            if (finalPrimitives.length > 0) {
                this.primitives.set(token, finalPrimitives);
        }  

        // al final la instancia se guarda con su token para que luego pueda ser resuelta con sus dependencias y primitivos que fueron guardado como metadatos en la misma instgancia gracias a reflect-metadata, ahora podemos acceder el metodo getMetada en esta instancia para recuperar toda esa info y usarla a la hora de resolver las dependencias y crear la instancia final que se va a devolver al consumidor.

        // Esto no es posible sin reflect-metadata, porque no podríamos guardar esa info directamente en la clase, y no podríamos recuperarla a la hora de resolver las dependencias.

        // por lo que el otro enfoque sin reflect-metadata es guardar toda esa info en un storage externo pero con reflect-metadata podemos guardar esa info directamente en la clase, lo que hace que el código sea más limpio y organizado, y además nos permite aprovechar el sistema de tipos de TypeScript para tener una mejor experiencia de desarrollo.
    }

    getService<T>(token: any, context?: Context ): T {
        // Aca podemos evaluar inmediatamente si es singleton ya que podemos ir buscarlo de inmediato en el map interno.

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

        const resolvedDependencies = paramTypes.map((depToken: any) => {


            // Si es un tipo primitivo, lo ignoramos aquí (lo manejaremos después)
            if (this.isPrimitiveType(depToken)) {
                return null;                    
            }

            if (depToken === token) {
                throw new Error(`[CIRCULAR DEPENDENCY]: Circular dependency detected for: ${token.name}`);
            }

            console.log(`Resolviendo dependencia para ${ImplClass.name}: ${depToken.name}`);
            return this.getService(depToken, context);
        }).filter(dep => dep !== null);  

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

    // Helper method para identificar tipos primitivos
private isPrimitiveType(type: any): boolean {
    if (!type) return true;
    
    const primitiveConstructors = [String, Number, Boolean, Object, Symbol, /*BigInt */];
    return primitiveConstructors.includes(type) || 
           typeof type === 'function' && 
           (type.name === 'String' || 
            type.name === 'Number' || 
            type.name === 'Boolean' || 
            type.name === 'Object');
    }   
}
