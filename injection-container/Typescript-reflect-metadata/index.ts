import { Motor, MotorImpl } from "./types/Motor";
import { Piston, PistonImpl } from "./types/Piston";
import { Vehicule, VehiculeImpl } from "./types/Vehicle";
import { VehiculeServiceProvider } from "./VehiculeServiceprovider";

const service = new VehiculeServiceProvider();

service.register(Piston, PistonImpl);
service.register(Motor, MotorImpl);
service.register(Vehicule, VehiculeImpl);

function main() {

   const scope = service.createScope();

    const vehicule = scope.get<Vehicule>(Vehicule);
    const vehicule_dos = scope.get<Vehicule>(Vehicule);
    const vehicule_tres = scope.get<Vehicule>(Vehicule);
    
    console.log(vehicule.get());
    console.log(vehicule_dos.get());
    console.log(vehicule_tres.get());

    scope.destroy();

}

main();
main();
