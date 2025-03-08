export interface Jugador {
    nombre: string;
    nacimiento: string;
    posicion: string;
    dorsal: number | string;
    nacionalidad: string;
    foto: string;
    altura: string;
}

export interface Entrenador {
    nombre: string;
    nacimiento: string;
    nacionalidad: string;
    foto: string;
}

export interface Plantilla {
    entrenador: Entrenador;
    jugadores: Jugador[];
}

export interface Estadio {
    nombre: string;
    foto: string;
}

export default interface Equipo {
    _id: string;
    nombre: string;
    escudo: string;
    puntos: number;
    estadio: Estadio;
    plantilla: Plantilla;
}