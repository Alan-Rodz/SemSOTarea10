import { Box, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import { Observable } from 'rxjs'
import type { NextPage } from 'next';

import { SistemaOperativo } from '../class/SistemaOperativo';
import React, { useEffect, useState } from 'react';
import { ContenedorSeccion } from '../component/seccion/ContenedorSeccion';
import { SeccionEjecucion } from '../component/seccion/SeccionEjecucion';
import { TituloSeccion } from '../component/seccion/TituloSeccion';
import { SeccionListos } from '../component/seccion/SeccionListos';
import { SeccionNuevos } from '../component/seccion/SeccionNuevos';
import { SeccionBloqueados } from '../component/seccion/SeccionBloqueados';
import { SeccionTerminados } from '../component/seccion/SeccionTerminados';
import { SeccionInformacion } from '../component/SeccionInformacion';
import { SeccionControles } from '../component/seccion/SeccionControles';
import { ModalProcesos } from '../component/ModalProcesos';

// *****************************************************************************************************************************
const VELOCIDAD = 500;
export const MENSAJE_PROGRAMA_TERMINADO = 'Programa Finalizado';
const teclasValidas = ['Enter', 'KeyC', 'KeyP', 'KeyI', 'KeyE', 'KeyT', 'KeyN', 'KeyB'];

export const GLOBAL_COLOR = '#DAF7DC';
export const GLOBAL_SECONDARY_COLOR = '#84DCC6';
export const GLOBAL_BORDER_RADIUS = 15;

// === App =====================================================================================================================
const sistemaOperativoOriginal = new SistemaOperativo(10, null, [], [], [], 0, [], 'Activo');

const observableSistemaOperativo$: Observable<SistemaOperativo> = new Observable(subscriber => {
  subscriber.next(sistemaOperativoOriginal);
  subscriber.complete();
});

const Home: NextPage = () => {

  // --- State ------------------------------------------------------------------------------------
  const [inputValue, setInputValue] = useState<string>('');

  const [sistemaOperativoMostrado, setSistemaOperativoMostrado] = useState<SistemaOperativo>(sistemaOperativoOriginal);
  const [isEvaluado, setIsEvaluado] = useState<boolean>(false);
  const [isComenzado, setIsComenzado] = useState<boolean>(false);

  const [isPausa, setIsPausa] = useState<boolean>(false);
  const [isInterrupcion, setIsInterrupcion] = useState<boolean>(false);

  const [isError, setIsError] = useState<boolean>(false);
  const [isTerminado, setIsTerminado] = useState<boolean>(false);

  const [isNuevoProceso, setIsNuevoProceso] = useState<boolean>(false);
  const [isTablaProcesos, setIsTablaProcesos] = useState<boolean>(false);

  const [mensaje, setMensaje] = useState<string>('');
  const [trigger, setTrigger] = useState<number>(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // --- Effects ------------------------------------------------------------------------------------
  useEffect(() => { /*actualizar estado del SO*/
    const modificarEstadoSO = setInterval(() => {

      sistemaOperativoOriginal.procesarAccion(isEvaluado, isComenzado, isPausa, isInterrupcion,
        setIsInterrupcion, isError, setIsError, isTerminado, setIsTerminado, isNuevoProceso, setIsNuevoProceso, setMensaje);

      setTrigger(trigger + 1);
    }, VELOCIDAD);

    return () => clearInterval(modificarEstadoSO);
  });

  useEffect(() => { /*actualizar el estado visual*/
    observableSistemaOperativo$.subscribe({
      next: estadoSO => {
        const newEstadoSO = { ...estadoSO };
        setSistemaOperativoMostrado(newEstadoSO as any /*NOTE: Look for bugs here*/);
        setMensaje('');
      },
      error: err => console.log(err),
      complete: () => { }
    });
  }, [trigger]);

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (!teclasValidas.includes(e.code)) { return; }

      /*else*/
      if (e.code === 'KeyC') {
        e.preventDefault();

        if (isEvaluado === false) { /*no se ha evaluado el programa todavía*/
          return;
        }

        if (isComenzado === false) { /*primera ejecución del programa*/
          setIsComenzado(!isComenzado);
          return;
        }
        
        if (isComenzado === true && isPausa === true) { /*regresando de la tabla de procesos*/
          onClose();
          setIsPausa(!isPausa);
        }
        
        
        else { return; } /*ninguno de los casos anteriores*/
      }

      if (e.code === 'KeyP') { e.preventDefault(); if (isComenzado === true) { setIsPausa(!isPausa); return; } else { return; } }

      if (e.code === 'KeyI') {
        e.preventDefault();
        if (isComenzado === true && isInterrupcion === false) {
          setIsInterrupcion(!isInterrupcion);
          return;
        } else {
          return;
        }
      }

      if (e.code === 'KeyE') { e.preventDefault(); if (isComenzado === true) { handleError(); setMensaje('Si hay un proceso en ejecución y la memoria está llena, será marcado como error.'); } else { return; } }
      if (e.code === 'KeyT') { e.preventDefault(); if (isComenzado === true) { setIsTerminado(!isTerminado); setMensaje(MENSAJE_PROGRAMA_TERMINADO); } else { return; } }
      if (e.code === 'KeyN') { e.preventDefault(); if (isComenzado === true) { setIsNuevoProceso(!isNuevoProceso); setMensaje('Agregando Proceso...'); } else { return; } }

      if (e.code === 'KeyB') {
        e.preventDefault();

        if (isTerminado === true ) { /*abriendo y cerrando después de que el programa terminó*/
          onOpen();
          return;
        }

        if (isComenzado === true) {
          if (isPausa === true) { return; } /*ignorar mientras la tabla de procesos está abierta porque se cierra con C*/

          setIsPausa(!isPausa); /*caso normal, se abre la tabla de procesos*/
          onOpen();

        } else { return; }
      }

    })
  })

  // --- Handlers --------------------------------------------------------------------------------------
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => { setInputValue((e.target as HTMLInputElement).value); }
  const handleInterrupcion = () => { setIsInterrupcion(!isInterrupcion); }
  const handleError = () => { setIsError(!isError); }
  const handleEvaluar = () => {
    if (parseInt(inputValue) && parseInt(inputValue) > 0) {
      setIsEvaluado(!isEvaluado);
      setMensaje('Cantidad De Procesos Válida');

      sistemaOperativoOriginal.setCantidadProcesos(parseInt(inputValue));
      sistemaOperativoOriginal.inicializar();

    } else {
      setMensaje('Cantidad De Procesos Inválida');
    }
  }

  return (
    <Grid h='100vh' templateRows='repeat(10, 1fr)' templateColumns='repeat(10, 1fr)'>
      {/* === Modal Tabla Procesos =============================================================================================================== */}
      <ModalProcesos isOpen={isOpen} onClose={onClose} isPausa={isPausa} isTerminado={isTerminado} setIsPausa={setIsPausa} sistemaOperativoActual={sistemaOperativoMostrado} />

      {/* === Ejecución =============================================================================================================== */}
      <GridItem
        overflowX={'scroll'}
        overflowY={'scroll'}
        gridAutoFlow={'column'}
        rowSpan={3}
        colSpan={4}
        bg={GLOBAL_COLOR}
        borderRadius={GLOBAL_BORDER_RADIUS}>
        <ContenedorSeccion>
          <SeccionEjecucion procesoMostrado={sistemaOperativoMostrado.getProcesoEnEjecucion()!/*NOTE: If err look here*/} />
        </ContenedorSeccion>
      </GridItem>

      <GridItem
        overflowX={'scroll'}
        overflowY={'scroll'}
        gridAutoFlow={'column'}
        colStart={5}
        rowStart={1}
        rowSpan={3}
        colSpan={6}
        bg={GLOBAL_COLOR}
        borderRadius={GLOBAL_BORDER_RADIUS}>

        {/* === Controles =============================================================================================================== */}
        <ContenedorSeccion>
          <TituloSeccion nombreSeccion={`Controles`} />
          <>
            <Box
              transform='translateX(-50%)'
              left='79%'
              position={'absolute'}
              bg={GLOBAL_SECONDARY_COLOR}
              borderRadius={GLOBAL_BORDER_RADIUS}
              mt={5}
              padding={3}
              fontSize={15}
            >
              {`Reloj: ${sistemaOperativoMostrado.getReloj()}`}
            </Box>
          </>
          <SeccionControles
            isPausa={isPausa}
            setIsPausa={setIsPausa}
            isNuevoProceso={isNuevoProceso}
            setIsNuevoProceso={setIsNuevoProceso}
            inputValue={inputValue}
            mensaje={mensaje}
            setMensaje={setMensaje}
            isEvaluado={isEvaluado}
            setIsEvaluado={setIsEvaluado}
            isComenzado={isComenzado}
            setIsComenzado={setIsComenzado}
            isTerminado={isTerminado}
            setIsTerminado={setIsTerminado}
            handleChange={handleChange}
            handleInterrupcion={handleInterrupcion}
            handleError={handleError}
            handleEvaluar={handleEvaluar}
            abrirTablaProcesos={onOpen}
          />
        </ContenedorSeccion>
      </GridItem>

      {/* === Listos =============================================================================================================== */}
      <GridItem
        overflowX={'scroll'}
        overflowY={'scroll'}
        gridAutoFlow={'column'}
        rowStart={4}
        rowSpan={4}
        colSpan={4}
        bg={GLOBAL_COLOR}
        borderRadius={GLOBAL_BORDER_RADIUS}>

        <ContenedorSeccion>
          <SeccionListos procesosListos={sistemaOperativoMostrado.getProcesosListos()} />
        </ContenedorSeccion>
      </GridItem>


      {/* === Nuevos =============================================================================================================== */}
      <GridItem
        overflowX={'scroll'}
        overflowY={'scroll'}
        gridAutoFlow={'column'}
        colStart={5}
        rowStart={4}
        rowSpan={4}
        colSpan={6}
        bg={GLOBAL_COLOR}
        borderRadius={GLOBAL_BORDER_RADIUS}>
        <ContenedorSeccion>
          <SeccionNuevos procesosNuevos={sistemaOperativoMostrado.getProcesosNuevos()} />
        </ContenedorSeccion>
      </GridItem>

      {/* === Bloqueados =============================================================================================================== */}
      <GridItem
        overflowX={'scroll'}
        overflowY={'scroll'}
        gridAutoFlow={'column'}
        rowStart={8}
        rowSpan={3}
        colSpan={4}
        bg={GLOBAL_COLOR}
        borderRadius={GLOBAL_BORDER_RADIUS}>
        <ContenedorSeccion>
          <SeccionBloqueados procesosBloqueados={sistemaOperativoMostrado.getProcesosBloqueados()} />
        </ContenedorSeccion>
      </GridItem>

      {/* === Terminados =============================================================================================================== */}
      <GridItem
        overflowX={'scroll'}
        overflowY={'scroll'}
        gridAutoFlow={'column'}
        rowStart={8}
        rowSpan={3}
        colStart={5}
        colSpan={3}
        bg={GLOBAL_COLOR}
        borderRadius={GLOBAL_BORDER_RADIUS}>
        <ContenedorSeccion>
          <SeccionTerminados procesosTerminados={sistemaOperativoMostrado.getProcesosTerminados()} />
        </ContenedorSeccion>
      </GridItem>

      {/* === Información =============================================================================================================== */}
      <GridItem
        overflowX={'scroll'}
        overflowY={'scroll'}
        gridAutoFlow={'column'}
        rowStart={8}
        rowSpan={3}
        colStart={8}
        colSpan={3}
        bg={GLOBAL_COLOR}
        borderRadius={GLOBAL_BORDER_RADIUS}>
        <ContenedorSeccion>
          <SeccionInformacion />
        </ContenedorSeccion>
      </GridItem>

    </Grid>);
}

export default Home