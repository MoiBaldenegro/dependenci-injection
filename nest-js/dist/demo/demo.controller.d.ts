import { DemoService } from './demo.service';
export declare class DemoController {
    private demoService;
    constructor(demoService: DemoService);
    getVehicule(): Promise<import("./types/vehicule").Vehicule>;
}
