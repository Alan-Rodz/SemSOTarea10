import { Center, Input, Flex, Box } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

import { GLOBAL_BORDER_RADIUS, MENSAJE_PROGRAMA_TERMINADO } from '../../pages';
import { Boton } from '../Boton';

// *****************************************************************************************************************************
interface SeccionControlesProps {
  isPausa: boolean,
  setIsPausa: Dispatch<SetStateAction<boolean>>;

  isNuevoProceso: boolean;
  setIsNuevoProceso: Dispatch<SetStateAction<boolean>>;

  inputValue: string;

  mensaje: string;
  setMensaje: Dispatch<SetStateAction<string>>;

  isEvaluado: boolean;
  setIsEvaluado: Dispatch<SetStateAction<boolean>>;

  isComenzado: boolean;
  setIsComenzado: Dispatch<SetStateAction<boolean>>;

  isTerminado: boolean;
  setIsTerminado: Dispatch<SetStateAction<boolean>>;

  handleChange: (e: React.FormEvent<HTMLInputElement>) => void;
  handleInterrupcion: () => void;
  handleError: () => void;
  handleEvaluar: () => void;

  abrirTablaProcesos: () => void;
}

export const SeccionControles: React.FC<SeccionControlesProps> =
  ({ isPausa, setIsPausa, isNuevoProceso, setIsNuevoProceso,
    inputValue, mensaje, setMensaje, isEvaluado, isComenzado, setIsComenzado, isTerminado, setIsTerminado,
    handleChange, handleEvaluar, handleInterrupcion, handleError, abrirTablaProcesos }) => {

    return (
      <>
        <Center>
          {!isEvaluado &&
            <Input
              mt={59}
              placeholder={'Cantidad de procesos...'}
              width={'50%|'}
              value={inputValue}
              onChange={handleChange}
              borderRadius={GLOBAL_BORDER_RADIUS}
              color={'black'}
            />
          }
        </Center>

        {
          !isEvaluado
            ?
            <Center>
              <Boton contenido={'Evaluar Cantidad (Dar Click Aquí)'} width={'50%'} callback={handleEvaluar} />
            </Center>
            : null
        }

        {
          (isEvaluado && !isComenzado) &&
          <Center>
            <Flex mt={20}>
              <Boton contenido={'Comenzar (Tecla C)'} width={'fit-content'} callback={() => setIsComenzado(!isComenzado)} />
            </Flex>
          </Center>
        }

        {
          (isComenzado && !isTerminado) &&
          <Flex mt={20}>
            <Box>
              <Boton contenido={`${isPausa ? 'Continuar (Tecla P)' : 'Pausar (Tecla P)'}`} width={'100%'} callback={() => setIsPausa(!isPausa)} />
              <Boton contenido={'Interrupción (Tecla I)'} width={'100%'} callback={handleInterrupcion} />
            </Box>

            <Box>
              <Boton contenido={'Marcar Error (Tecla E)'} width={'100%'} callback={handleError} />
              {
                !isTerminado &&
                <>
                  <Boton contenido={'Terminar (Tecla T)'} width={'100%'} callback={() => { setIsTerminado(!isTerminado); setMensaje(MENSAJE_PROGRAMA_TERMINADO); }} />
                </>
              }
            </Box>

            <Box>
              <Boton contenido={`Crear Nuevo Proceso Aleatorio (Tecla N)`} width={'100%'} callback={() => setIsNuevoProceso(!isNuevoProceso)} />
              <Boton contenido={'Ver Tabla de Procesos (Tecla B)'} width={'100%'} callback={() => { setIsPausa(!isPausa); abrirTablaProcesos(); }} />
            </Box>
          </Flex>
        }

        <Center mt={5}>
          {!isTerminado
            ? <Box fontSize={15}>{mensaje}</Box>
            :
            <>
              <Center>
                <Box>
                  <Center>
                    <Box fontSize={15} mt={20} mb={5}>{mensaje}</Box>
                  </Center>
                  <Boton contenido={'Ver Tabla de Procesos (Tecla B)'} width={'100%'} callback={() => { abrirTablaProcesos(); }} />
                </Box>
              </Center>
            </>
          }
        </Center>
      </>
    )
  }