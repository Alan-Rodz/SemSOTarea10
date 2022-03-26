import { Box } from '@chakra-ui/react';
import { Proceso } from '../class/Proceso';

import { GLOBAL_BORDER_RADIUS, GLOBAL_SECONDARY_COLOR } from '../pages/index';

// ********************************************************************************
export interface ProcesoProps {
    proceso: Proceso;
    width: string;
}
const SEPARADOR = '--';
export const ComponenteProceso: React.FC<ProcesoProps> = ({ width, proceso }) => {
    return (
        <>
            {/*** Proceso Nuevo ******************************************************************************************************************/}
            {
                (proceso.estado === 'Nuevo' || proceso.estado === 'Listo') &&
                <Box
                    width={'width'}
                    borderRadius={GLOBAL_BORDER_RADIUS}
                    padding={1}
                    mt={10}
                    ml={10}
                    mr={10}
                    bg={GLOBAL_SECONDARY_COLOR}
                    fontSize={15}
                >
                    <Box>
                        {(proceso.estado === 'Nuevo' || proceso.estado === 'Listo')
                            &&
                            `(ID: ${proceso.ID}) ${SEPARADOR}
                            (TME: ${proceso.tiempoRestante}) ${SEPARADOR}     
                            (TR: ${proceso.tiempoTotal}) ${SEPARADOR}     
                            (Operación: ${proceso.operacion}) ${SEPARADOR}     
                            (Operando1: ${proceso.operando1}) ${SEPARADOR}     
                            (Operando2: ${proceso.operando2})`
                        }
                    </Box>
                </Box>
            }

            {/*** Proceso En Ejecucion ******************************************************************************************************************/}
            {
                proceso.estado === 'Ejecucion' &&
                <Box
                    width={width}
                    borderRadius={GLOBAL_BORDER_RADIUS}
                    padding={1}
                    mt={10}
                    ml={10}
                    mr={10}
                    bg={GLOBAL_SECONDARY_COLOR}
                    fontSize={15}
                >
                    <Box>
                        {(proceso.estado === 'Ejecucion' && proceso.error === false)
                            &&
                            `(ID: ${proceso.ID}) ${SEPARADOR}     
                            (TME: ${proceso.tiempoMaximoEstimado}) ${SEPARADOR}
                            (TR: ${proceso.tiempoRestante}) ${SEPARADOR} 
                            (TT: ${proceso.tiempoTotal}) ${SEPARADOR}
                            (Operación: ${proceso.operacion}) ${SEPARADOR} 
                            (Operando1: ${proceso.operando1}) ${SEPARADOR}
                            (Operando2: ${proceso.operando2})
                            `
                        }
                    </Box>
                </Box>
            }

            {/*** Proceso Bloqueado ******************************************************************************************************************/}
            {
                proceso.estado === 'Bloqueado' &&
                <Box
                    width={width}
                    borderRadius={GLOBAL_BORDER_RADIUS}
                    padding={1}
                    mt={10}
                    ml={10}
                    mr={10}
                    bg={GLOBAL_SECONDARY_COLOR}
                    fontSize={15}
                >
                    <Box>
                        {(proceso.estado === 'Bloqueado' && proceso.error === false)
                            &&
                            `(ID: ${proceso.ID}) ${SEPARADOR}   
                            (Tiempo Bloqueado: ${proceso.tiempoBloqueado})`
                        }
                    </Box>
                </Box>
            }

            {/*** Proceso Terminado ******************************************************************************************************************/}
            {
                proceso.estado === 'Terminado' &&
                <Box
                    width={width}
                    borderRadius={GLOBAL_BORDER_RADIUS}
                    padding={1}
                    mt={10}
                    ml={10}
                    mr={10}
                    bg={GLOBAL_SECONDARY_COLOR}
                    fontSize={15}
                >
                    <Box>
                        {(proceso.estado === 'Terminado' && proceso.error === false)
                            &&
                            `(ID: ${proceso.ID}) ${SEPARADOR}

                            (TME: ${proceso.tiempoMaximoEstimado}) ${SEPARADOR}
                            (TR: ${proceso.tiempoRestante}) ${SEPARADOR} 
                            (TT: ${proceso.tiempoTotal}) ${SEPARADOR}
                            (Tiempo Bloqueado: ${proceso.tiempoBloqueado}) ${SEPARADOR}

                            (Operación: ${proceso.operacion}) ${SEPARADOR} 
                            (Operando1: ${proceso.operando1}) ${SEPARADOR}
                            (Operando2: ${proceso.operando2}) 
                            (Resultado: ${proceso.resultado})
                            
                            (Tiempo de Llegada: ${proceso.tiempoLlegada}) ${SEPARADOR}
                            (Tiempo de Finalización: ${proceso.tiempoFinalizacion}) ${SEPARADOR}
                            (Tiempo de Espera: ${proceso.tiempoEspera}) ${SEPARADOR}
                            (Tiempo de Servicio: ${proceso.tiempoServicio}) ${SEPARADOR}
                            (Tiempo de Retorno: ${proceso.tiempoRetorno}) ${SEPARADOR}
                            (Tiempo de Respuesta: ${proceso.tiempoRespuesta})
                            `
                            
                        }
                        {(proceso.estado === 'Terminado' && proceso.error === true)
                            &&
                            `(ID: ${proceso.ID}) ${SEPARADOR}

                            (TME: ${proceso.tiempoMaximoEstimado}) ${SEPARADOR}
                            (TR: ${proceso.tiempoRestante}) ${SEPARADOR} 
                            (TT: ${proceso.tiempoTotal}) ${SEPARADOR}     
                            
                            (Operación: ${proceso.operacion}) ${SEPARADOR} 
                            (Operando1: ${proceso.operando1}) ${SEPARADOR}
                            (Operando2: ${proceso.operando2}) 
                            (Resultado: ERROR)
                            
                            (Tiempo de Llegada: ${proceso.tiempoLlegada}) ${SEPARADOR}
                            (Tiempo de Finalización: ${proceso.tiempoFinalizacion}) ${SEPARADOR}
                            (Tiempo de Espera: ${proceso.tiempoEspera}) ${SEPARADOR}
                            (Tiempo de Servicio: ${proceso.tiempoServicio}) ${SEPARADOR}
                            (Tiempo de Retorno: ${proceso.tiempoRetorno}) ${SEPARADOR}
                            (Tiempo de Respuesta: ${proceso.tiempoRespuesta})
                            `
                        }
                    </Box>
                </Box>
            }
        </>
    )
}