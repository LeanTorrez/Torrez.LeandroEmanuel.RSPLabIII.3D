class Personaje{
    constructor(id, nombre,tipo){
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo
    }
}

export class Monstruo extends Personaje{
    constructor(id,nombre,tipo,alias,miedo,defensa){
        super(id,nombre,tipo);
        this.alias = alias;
        this.miedo = miedo;
        this.defensa = defensa;
    }

    eliminarId() {
        const {id,...monstruoSinId} = this;
        return  monstruoSinId;
    }
}