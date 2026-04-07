import { lifeTime } from "./constants/lifetimes";
import { MetadataStorage } from "./injectable/storage";
import { Context, ServiceProvider } from "./types/serviceProvider";


    
export class VehiculeServiceProvider implements ServiceProvider {
    private _services = new Map<any, any>();
    private _instances = new Map<any, any>();

   
    createScope() {
        const context = new Map<any, any>();
        
        return {
            get: <T>(token: any): T => this.getService(token, context),
            destroy: () => context.clear()
        };
    }

    register(token: any, implementation: any): void {
        this._services.set(token, implementation);
    }

    getService<T>(token: any, context?: Context ): T {
        const ImplClass = this._services.get(token);

        if (!ImplClass) throw new Error(`Token no registrado: ${token.name}`);

        const metadata = MetadataStorage.get(ImplClass);


        // --- LÓGICA DE SINGLETON ---
        if (metadata?.lifetime === lifeTime.SINGLETON) {
            if (this._instances.has(token)) {
                console.log(`[DI] Devolviendo Singleton existente de: ${token.name}`);
                return this._instances.get(token);
            }
        }

       // 2. SCOPED: Solo si me pasaron un contexto y ya existe ahí
        if (metadata?.lifetime === lifeTime.SCOPED && context && context.has(token)) {
            console.log(`[DI] Reutilizando SCOPED para este contexto: ${token.name}`);
            return context.get(token);
        }
        
        if (!metadata) {
            return Reflect.construct(ImplClass, []) as T;
        }

        // 3. Creación de la instancia
        const deps = metadata?.deps || [];
        const resolvedDeps = deps.map(depToken => {
            const result = this.getService(depToken, context);
            if (!result) throw new Error(`No se pudo resolver la dependencia: ${depToken.name}`);
            return result;
        });

        const args = [...resolvedDeps, ...(metadata?.primitives || [])];
        const instance = Reflect.construct(ImplClass, args) as T;
        if (metadata?.lifetime === lifeTime.SINGLETON) {
            this._instances.set(token, instance);
        } else if (metadata?.lifetime === lifeTime.SCOPED && context) {
            context.set(token, instance);
        }

        return instance;
    }
}