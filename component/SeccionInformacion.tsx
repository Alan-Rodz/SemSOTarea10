import { Box, Center, Flex } from '@chakra-ui/react'
import Link from 'next/link'

import { GLOBAL_BORDER_RADIUS, GLOBAL_SECONDARY_COLOR } from '../pages'
import { TituloSeccion } from './seccion/TituloSeccion'

// ********************************************************************************
export const SeccionInformacion: React.FC = () => {
  return (
    <>
      <TituloSeccion nombreSeccion={`Información`} />
      <Box w='100%' h='100%' py={2} borderColor='gray.300'>
        <Flex mt={50} flexDir={'column'}>
          <Center>
            <Box
              width={'75%'}
              borderRadius={GLOBAL_BORDER_RADIUS}
              mt={6}
              padding={3}
              bg={GLOBAL_SECONDARY_COLOR}
              fontSize={15}
            >
              <Center>
                Simulador de Sistema Operativo
              </Center>

              <Center color={'blue'}>
                <Link href={'https://www.linkedin.com/in/alan-rodriguez-16b074192/'}>
                  Alan Ramiro Rodríguez González
                </Link>
              </Center>
            </Box>
          </Center>
        </Flex>
      </Box>
    </>
  )
}