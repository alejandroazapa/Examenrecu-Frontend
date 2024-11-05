import { Coche } from "./coche";

export class Tipo {
    id: number;
    nombre: string;
    coche: Coche;

    constructor(id: number = 0, nombre: string = '', coche: Coche) {
        this.id = id;
        this.nombre = nombre;
        this.coche = coche;
    }
}
