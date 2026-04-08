import { lifeTime } from "./constants/lifetimes";
import { Motor, MotorImpl } from "./types/Motor";
import { Piston, PistonImpl } from "./types/Piston";
import { Vehicule, VehiculeImpl } from "./types/Vehicle";
import { VehiculeServiceProvider } from "./VehiculeServiceprovider";

const service = new VehiculeServiceProvider();

service.register(Piston, PistonImpl, { 
    lifetime: lifeTime.SINGLETON, 
});
service.register(Motor, MotorImpl);
service.register(Vehicule, VehiculeImpl, { 
    lifetime: lifeTime.TRANSIENT, 
    primitives: ["MAZDA", "CX-3"]
});

function main() {

   const scope = service.createScope();

    const vehicule = scope.get<Vehicule>(Vehicule);
    const vehicule_dos = scope.get<Vehicule>(Vehicule);
    scope.destroy();

    const vehicule_tres = scope.get<Vehicule>(Vehicule);
    scope.destroy();
    
    console.log(vehicule.get());
    console.log(vehicule_dos.get());
    console.log(vehicule_tres.get());


}

main();
main();
