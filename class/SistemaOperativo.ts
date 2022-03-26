import { Estado, Operacion, operacionesValidas, Proceso } from './Proceso';
import { generarNumeroAleatorio } from '../util/generarNumeroAleatorio'
import { generarUUID } from '../util/generarUUID';

// ********************************************************************************
export const CONSTANTE_TIEMPO_BLOQUEADO = 8;
export const CONSTANTE_MEMORIA = 5;
export const PROGRAMA_FINALIZADO = 'Programa Finalizado';

export type EstadoSO = 'Activo' | 'Terminado';
export class SistemaOperativo {
    private cantidadProcesos: number;
    private procesoEnEjecucion: Proceso | null;
    private procesosBloqueados: Proceso[];
    private procesosNuevos: Proceso[];
    private procesosTerminados: Proceso[];
    private reloj: number;
    private procesosListos: Proceso[];
    private estadoSO: EstadoSO;

    constructor(cantidadProcesos: number, procesoEnEjecucion: Proceso | null, procesosBloqueados: Proceso[], procesosNuevos: Proceso[], procesosTerminados: Proceso[], reloj: number, procesosListos: Proceso[], estadoSO: EstadoSO) {
        this.cantidadProcesos = cantidadProcesos;
        this.procesoEnEjecucion = procesoEnEjecucion;
        this.procesosBloqueados = procesosBloqueados;
        this.procesosNuevos = procesosNuevos;
        this.procesosTerminados = procesosTerminados;
        this.reloj = reloj;
        this.procesosListos = procesosListos;
        this.estadoSO = estadoSO;
    }

    // --- Estado ----------------------------------------------------------------------------------------------------
    public inicializar = () => {
        for (let i = 0; i < this.cantidadProcesos; i++) {
            const nuevoProceso = this.generarProcesoAleatorio();
            this.procesosNuevos.push(nuevoProceso);
        }
    }

    public procesarAccion = 
        (isEvaluado: boolean, isComenzado: boolean, isPausa: boolean, isInterrupcion: boolean, setIsInterrupcion: React.Dispatch<React.SetStateAction<boolean>>, 
        isError: boolean, setIsError: React.Dispatch<React.SetStateAction<boolean>>,
        isTerminado: boolean, setIsTerminado: React.Dispatch<React.SetStateAction<boolean>>,
        isNuevoProceso: boolean, setIsNuevoProceso: React.Dispatch<React.SetStateAction<boolean>>, 
        setMensaje: React.Dispatch<React.SetStateAction<string>>) => {
            
            // ... Banderas .............................................................................................
            if (isTerminado === true) { return/*el programa ha terminado*/; }
            if (!isEvaluado) { return/*no se ha evaluado todavía*/; }
            if (!isComenzado) { return/*el programa no ha comenzado*/; }
            if (isPausa) {  this.incrementarValores(); return/*el programa está pausado*/;  }

            // ... Interrupcion .......................................................................................................
            if (isInterrupcion === true) { 
                if (!this.procesoEnEjecucion || (this.procesosBloqueados.length + this.procesosListos.length >= 5) ) {  setIsInterrupcion(!isInterrupcion); return;  }
                const procesoInterrumpido = this.procesoEnEjecucion;
                procesoInterrumpido.estado = 'Bloqueado';
                this.procesosBloqueados.push(procesoInterrumpido);

                this.procesoEnEjecucion = null;

                setIsInterrupcion(!isInterrupcion);
                this.incrementarValores();
                return;
            }

            // ... Error ..............................................................................................................
            if (isError) { 
                if (!this.procesoEnEjecucion) {  setIsError(!isError)/*regresar a default*/; return;  }

                const procesoTerminado = this.procesoEnEjecucion;
                procesoTerminado.estado = 'Terminado';
                procesoTerminado.error = true;
                procesoTerminado.tiempoFinalizacion = this.reloj;
                procesoTerminado.tiempoRetorno = procesoTerminado.tiempoEspera + procesoTerminado.tiempoServicio;

                this.procesosTerminados.push(procesoTerminado);
                this.procesoEnEjecucion = null/*proceso terminado*/;
                
                setIsError(!isError)/*regresar a default*/; 
                this.incrementarValores();
                return;
            }

            // ... Nuevo Proceso ......................................................................................................
            if (isNuevoProceso) {
                const nuevoProceso = this.generarProcesoAleatorio();
                nuevoProceso.tiempoLlegada = this.reloj;
                this.procesosNuevos.push(nuevoProceso);
                setIsNuevoProceso(!isNuevoProceso)/*regresar a default*/; 
                this.incrementarValores();
                return;
            }

            // ... Comportamiento Default .............................................................................................
            if (this.procesosBloqueados.length !== 0) { this.procesarBloqueados(); }

            if (this.procesosListos.length < 5) { /*llenar procesos listos*/
                const procesoListo = this.procesosNuevos.shift();
                if (procesoListo) { 
                    procesoListo.estado = 'Listo';

                    this.procesosListos.push(procesoListo); 
                }
                this.incrementarValores();

                if (this.procesosNuevos.length !== 0) { return;}
            }

            if (this.procesosListos.length !== 0 && !this.procesoEnEjecucion) { /*agregar proceso a ejecución*/
                const procesoEjecutado = this.procesosListos.shift();
                if (procesoEjecutado) {
                    procesoEjecutado.estado ='Ejecucion';
                    procesoEjecutado.tiempoRespuesta = this.reloj - procesoEjecutado.tiempoLlegada;

                    this.procesoEnEjecucion = procesoEjecutado;
                }
            }

            if (this.procesoEnEjecucion) { /*procesamiento default*/
                this.procesoEnEjecucion.tiempoRestante--;
                this.procesoEnEjecucion.tiempoTotal++;
                this.procesoEnEjecucion.tiempoServicio++;
            }

            if (this.procesoEnEjecucion) {
                if (this.procesoEnEjecucion.tiempoTotal === this.procesoEnEjecucion.tiempoMaximoEstimado) {
                    const procesoTerminado = this.procesoEnEjecucion;
                    procesoTerminado.estado = 'Terminado';
                    procesoTerminado.tiempoFinalizacion = this.reloj;
                    procesoTerminado.tiempoRetorno = procesoTerminado.tiempoEspera + procesoTerminado.tiempoServicio;
                    

                    this.procesosTerminados.push(procesoTerminado);
                    this.procesoEnEjecucion = null/*proceso terminado*/;
                }
            }


            this.incrementarValores();
            if (!this.procesoEnEjecucion && this.procesosNuevos.length === 0 && this.procesosListos.length === 0 && this.procesosBloqueados.length === 0) { 
                setIsTerminado(!isTerminado); 
                setMensaje(PROGRAMA_FINALIZADO)
            }
    }


    private generarProcesoAleatorio = (): Proceso => {
        const idGenerado = generarUUID();
        const tmeGenerado = Math.floor(Math.random() * (16 - 6) + 6);
        const trGenerado = tmeGenerado;
        const ttGenerado = 0;

        const opGenerada: Operacion = operacionesValidas[Math.floor(Math.random() * operacionesValidas.length)];
        let op1Generado = 0;
        let op2Generado = 0;
        if (opGenerada === '+') {
            op1Generado = generarNumeroAleatorio();
            op2Generado = generarNumeroAleatorio();
        }
        else if (opGenerada === '-') {
            op1Generado = generarNumeroAleatorio();
            op2Generado = generarNumeroAleatorio();
        }
        else if (opGenerada === '*') {
            op1Generado = generarNumeroAleatorio();
            op2Generado = generarNumeroAleatorio();
        }
        else if (opGenerada === '/') {
            let bandera = true;
            while (bandera === true) {
                op1Generado = generarNumeroAleatorio();
                op2Generado = generarNumeroAleatorio();
                (op1Generado === 0 || op2Generado == 0) ? bandera = true : bandera = false;
            }
        }
        else if (opGenerada === '%') {
            let bandera = true;
            while (bandera === true) {
                op1Generado = generarNumeroAleatorio();
                op2Generado = generarNumeroAleatorio();
                (op1Generado === 0 || op2Generado == 0) ? bandera = true : bandera = false;
            }
        }

        let resultadoGenerado = 0;
        if (opGenerada === '+') { resultadoGenerado = Math.ceil(op1Generado + op2Generado); }
        else if (opGenerada === '-') { resultadoGenerado = Math.ceil(op1Generado - op2Generado); }
        else if (opGenerada === '*') { resultadoGenerado = Math.ceil(op1Generado * op2Generado); }
        else if (opGenerada === '/') { resultadoGenerado = Math.ceil(op1Generado / op2Generado); }
        else if (opGenerada === '%') { resultadoGenerado = Math.ceil(op1Generado % op2Generado); }

        const estadoGenerado: Estado = 'Nuevo';
        const errorGenerado = false;

        const nuevoProceso = new Proceso(idGenerado, tmeGenerado, trGenerado, ttGenerado, opGenerada, op1Generado, op2Generado, resultadoGenerado, estadoGenerado, errorGenerado);
        return nuevoProceso;
    }

    private incrementarValores = () => {
        this.reloj++;

        this.procesosNuevos.forEach(proceso => proceso.tiempoEspera++);
    }

    private procesarBloqueados = () => {
        const nuevosProcesosBloqueados: Proceso[] = [];

        this.procesosBloqueados.forEach(proceso => {
            if (proceso.tiempoBloqueado === CONSTANTE_TIEMPO_BLOQUEADO) {
                const procesoListo = proceso;
                proceso.estado = 'Listo';
                this.procesosListos.push(procesoListo);
                return;
            }

            /*else*/
            proceso.tiempoEspera++
            proceso.tiempoBloqueado++;
            nuevosProcesosBloqueados.push(proceso);
        });

        this.procesosBloqueados = nuevosProcesosBloqueados;
    }

    // --- Getters ----------------------------------------------------------------------------------------------------
    public imprimirSO = () => { console.log(this); }
    public getCantidadProcesos = (): number => { return this.cantidadProcesos; }
    public getProcesoEnEjecucion = (): Proceso | null => { return this.procesoEnEjecucion; }
    public getProcesosBloqueados = (): Proceso[] => { return this.procesosBloqueados; }
    public getProcesosNuevos = (): Proceso[] => { return this.procesosNuevos; }
    public getProcesosTerminados = (): Proceso[] => { return this.procesosTerminados; }
    public getReloj = (): number => { return this.reloj; }
    public getProcesosListos = (): Proceso[] => { return this.procesosListos; }
    public getTodosLosProcesos = (): Proceso[] => {
        const todosLosProcesos: Proceso[] = [];

        if (this.procesoEnEjecucion) { todosLosProcesos.push(this.procesoEnEjecucion); }

        this.procesosListos.forEach(proceso => todosLosProcesos.push(proceso));
        this.procesosNuevos.forEach(proceso => todosLosProcesos.push(proceso));
        this.procesosBloqueados.forEach(proceso => todosLosProcesos.push(proceso));
        this.procesosTerminados.forEach(proceso => todosLosProcesos.push(proceso));

        return todosLosProcesos;
    }

    // --- Setters ----------------------------------------------------------------------------------------------------
    public setCantidadProcesos = (cantidad: number): SistemaOperativo => {
        this.cantidadProcesos = cantidad;
        const nuevoEstado = { ...this };
        return nuevoEstado;
    }

}