import { Box, Flex } from '@chakra-ui/react';
import { Proceso } from '../../class/Proceso';

import { ComponenteProceso } from '../ComponenteProceso';
import { TituloSeccion } from './TituloSeccion';

// ********************************************************************************
export interface SeccionListoProps { procesosListos: Proceso[] }

export const SeccionListos: React.FC<SeccionListoProps> = ({ procesosListos}) => {
    return (
        <Box w='100%' h='100%' py={2} borderColor='gray.300'>
            <Flex mt={50} flexDir={'column'}>
                <TituloSeccion nombreSeccion={`Listos: ${procesosListos.length}`} />
                { procesosListos.map((proceso, index) => <ComponenteProceso proceso={proceso} width={'100%'} key={index}/>) }
            </Flex>
        </Box>
    )
}