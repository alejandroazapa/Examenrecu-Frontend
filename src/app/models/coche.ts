export class Coche {
    id: number;
    placa: string;
    puerta: string;

    constructor(id: number = 0, nombre: string = '') {
        this.id = id;
        this.placa = nombre;
        this.puerta = nombre;
    }
}
