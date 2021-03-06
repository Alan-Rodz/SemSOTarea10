import { Box, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import { Observable } from 'rxjs'
import type { NextPage } from 'next';
import React, { useCallback, useEffect, useState } from 'react';

import { handleKeyPress } from '../action/handleKeyPress';
import { SistemaOperativo } from '../class/SistemaOperativo';
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

export const GLOBAL_COLOR = '#ade8f4';
export const GLOBAL_SECONDARY_COLOR = '#48cae4';
export const GLOBAL_BORDER_RADIUS = 15;

// === App =====================================================================================================================
const sistemaOperativoOriginal = new SistemaOperativo(10, null, [], [], [], 0, [], 'Activo');

const observableSistemaOperativo$: Observable<SistemaOperativo> = new Observable(subscriber => {
  subscriber.next(sistemaOperativoOriginal);
  subscriber.complete();
});

const Home: NextPage = () => {

  // --- State ------------------------------------------------------------------------------------
  const [valorInputCantidadProcesos, setValorInputCantidadProcesos] = useState<string>('');
  const [valorInputQuantum, setValorInputQuantum] = useState<string>('');

  const [sistemaOperativoMostrado, setSistemaOperativoMostrado] = useState<SistemaOperativo>(sistemaOperativoOriginal);
  const [isEvaluado, setIsEvaluado] = useState<boolean>(false);
  const [isComenzado, setIsComenzado] = useState<boolean>(false);

  const [isPausa, setIsPausa] = useState<boolean>(false);
  const [isInterrupcion, setIsInterrupcion] = useState<boolean>(false);

  const [isError, setIsError] = useState<boolean>(false);
  const [isTerminado, setIsTerminado] = useState<boolean>(false);

  const [isNuevoProceso, setIsNuevoProceso] = useState<boolean>(false);

  const [mensaje, setMensaje] = useState<string>('');
  const [trigger, setTrigger] = useState<number>(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // --- Handlers --------------------------------------------------------------------------------------
  const handleChangeInputCantidadProcesos = (e: React.FormEvent<HTMLInputElement>) => { setValorInputCantidadProcesos((e.target as HTMLInputElement).value); }
  const handleChangeValorInputQuantum = (e: React.FormEvent<HTMLInputElement>) => { setValorInputQuantum((e.target as HTMLInputElement).value); }
  const handleInterrupcion = () => { setIsInterrupcion(!isInterrupcion); }
  const handleError = useCallback(() => { setIsError(!isError); }, [isError])
  const handleEvaluar = () => {
    if ((parseInt(valorInputCantidadProcesos) && parseInt(valorInputCantidadProcesos) > 0) && (parseInt(valorInputQuantum) && parseInt(valorInputQuantum) > 0)) {
      setIsEvaluado(!isEvaluado);
      setMensaje('Cantidades V??lidas');

      sistemaOperativoOriginal.setCantidadProcesos(parseInt(valorInputCantidadProcesos));
      sistemaOperativoOriginal.setQuantum(parseInt(valorInputQuantum));
      sistemaOperativoOriginal.inicializar();

    } else {
      setMensaje('Cantidades Inv??lidas');
    }
  }

  // --- Callbacks --------------------------------------------------------------------------------------
  const handleUserKeyPress = useCallback((event: KeyboardEvent) => {
    handleKeyPress(event, isEvaluado, isComenzado, setIsComenzado, isPausa, setIsPausa, onClose, isInterrupcion, setIsInterrupcion, handleError, setMensaje, isTerminado, setIsTerminado, isNuevoProceso, setIsNuevoProceso, onOpen);
  }, [handleError, isComenzado, isEvaluado, isInterrupcion, isNuevoProceso, isPausa, isTerminado, onClose, onOpen]);

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
    document.addEventListener('keydown', handleUserKeyPress);
    return () => { document.removeEventListener('keydown', handleUserKeyPress); };
  }, [handleUserKeyPress]);


  return (
    <Grid h='100vh' templateRows='repeat(10, 1fr)' templateColumns='repeat(10, 1fr)' gap={1} backgroundColor={'black'} >
      {/* === Modal Tabla Procesos =============================================================================================================== */}
      <ModalProcesos isOpen={isOpen} onClose={onClose} isPausa={isPausa} isTerminado={isTerminado} setIsPausa={setIsPausa} sistemaOperativoActual={sistemaOperativoMostrado} />

      {/* === Ejecuci??n =============================================================================================================== */}
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
              transform={'translateX(-50%)'}
              left={'79%'}
              position={'absolute'}
              bg={GLOBAL_SECONDARY_COLOR}
              borderRadius={GLOBAL_BORDER_RADIUS}
              padding={3}
              fontSize={15}
              width={'fit-content'}
            >
              {`Reloj: ${sistemaOperativoMostrado.getReloj()}  Quantum: ${sistemaOperativoMostrado.getQuantum()}`}
            </Box>
          </>
          <SeccionControles
            isPausa={isPausa}
            setIsPausa={setIsPausa}
            isNuevoProceso={isNuevoProceso}
            setIsNuevoProceso={setIsNuevoProceso}
            valorInputCantidadProcesos={valorInputCantidadProcesos}
            valorInputQuantum={valorInputQuantum}
            mensaje={mensaje}
            setMensaje={setMensaje}
            isEvaluado={isEvaluado}
            setIsEvaluado={setIsEvaluado}
            isComenzado={isComenzado}
            setIsComenzado={setIsComenzado}
            isTerminado={isTerminado}
            setIsTerminado={setIsTerminado}
            handleChangeValorInputCantidadProcesos={handleChangeInputCantidadProcesos}
            handleChangeValorInputQuantum={handleChangeValorInputQuantum}
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
        paddingBottom={3}
        paddingRight={6}
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

      {/* === Informaci??n =============================================================================================================== */}
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