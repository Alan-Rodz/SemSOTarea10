// ********************************************************************************
export const operacionesValidas: Operacion[] = ['+', '-', '/', '*', '%'];
export type Operacion = '+' | '-' | '/' | '*' | '%';

export type Estado = 'Nuevo'| 'Listo' | 'Ejecucion' | 'Bloqueado' | 'Terminado';

export class Proceso {    
    ID: string;
    tiempoMaximoEstimado: number;
    tiempoRestante: number;
    tiempoTotal: number;
    operacion: Operacion;
    operando1: number; 
    operando2: number; 
    resultado: number; 
    estado: Estado;
    error: boolean;
    tiempoBloqueado: number;

    tiempoLlegada: number;
    tiempoFinalizacion: number;
    tiempoEspera: number;
    tiempoServicio: number;
    tiempoRetorno: number;
    tiempoRespuesta: number;


    constructor(ID: string, tiempoMaximoEstimado: number, tiempoRestante: number, tiempoTotal: number, operacion: Operacion, operando1: number,  operando2: number,  resultado: number,  estado: Estado, error: boolean){
        this.ID = ID;
        this.tiempoMaximoEstimado = tiempoMaximoEstimado;
        this.tiempoRestante = tiempoRestante;
        this.tiempoTotal = tiempoTotal;
        this.operacion = operacion;
        this. operando1 = operando1;
        this.operando2 = operando2;
        this.resultado = resultado;
        this.estado = estado;
        this.error = error;
        this.tiempoBloqueado = 0;

        this.tiempoLlegada = 0;
        this.tiempoFinalizacion = 0;
        this.tiempoEspera = 0;
        this.tiempoServicio = 0;
        this.tiempoRetorno = 0;
        this.tiempoRespuesta = 0;
    }

}