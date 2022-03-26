import { Box, Flex } from '@chakra-ui/react';

import { Proceso } from '../../class/Proceso';
import { ComponenteProceso } from '../ComponenteProceso';

import { TituloSeccion } from './TituloSeccion';

// ********************************************************************************
export interface SeccionNuevosProps {procesosNuevos: Proceso[]}

export const SeccionNuevos: React.FC<SeccionNuevosProps> = ({procesosNuevos }) => {
    return (
        <Box w='100%' h='100%' py={2} borderColor='gray.300'>
            <Flex mt={50} flexDir={'column'}>
                <TituloSeccion nombreSeccion={`Nuevos: ${procesosNuevos.length}`} />
                {procesosNuevos.map((proceso, index) => <ComponenteProceso proceso={proceso} width={'100%'} key={index}/>)}
            </Flex>
        </Box>
    )
}