import { Box, Flex } from '@chakra-ui/react';

import { Proceso } from '../../class/Proceso';
import { ComponenteProceso } from '../ComponenteProceso';
import { TituloSeccion } from './TituloSeccion';

// ********************************************************************************
export interface SeccionEjecucionProps { procesoMostrado: Proceso }

export const SeccionEjecucion: React.FC<SeccionEjecucionProps> = ({ procesoMostrado }) => {
    return (
        <Box w='100%' h='100%' py={2} borderColor='gray.300'>
            <Flex mt={50} flexDir={'column'}>
                <TituloSeccion nombreSeccion={'En Ejecución'} />
                {procesoMostrado && 
                    <ComponenteProceso proceso={procesoMostrado} width={'100%'}/>
                }
            </Flex>
        </Box>
    )
}