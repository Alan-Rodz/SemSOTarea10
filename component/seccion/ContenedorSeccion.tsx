import { Box } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { GLOBAL_BORDER_RADIUS, GLOBAL_COLOR } from '../../pages'

// ********************************************************************************
export const ContenedorSeccion: React.FC<ReactNode> = ({ children }) => {
    return (
        <Box borderRadius={GLOBAL_BORDER_RADIUS} bg={GLOBAL_COLOR} fontSize={'10'} width='100%' height='100%' position='relative' transform={'scale(0.8, 0.8)'}>
            {children}
        </Box>
    )
}