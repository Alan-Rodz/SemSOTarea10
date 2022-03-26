import { Box } from '@chakra-ui/react';

import { GLOBAL_COLOR, GLOBAL_SECONDARY_COLOR, GLOBAL_BORDER_RADIUS } from '../../pages';

// ********************************************************************************
export interface TituloSeccionProps {
  nombreSeccion: string;
}

export const TituloSeccion: React.FC<TituloSeccionProps> = ({ nombreSeccion }) => {
  return (
    <>
      <Box
        transform='translateX(-50%)'
        top='0'
        left='50%'
        position={'absolute'}
        bg={GLOBAL_SECONDARY_COLOR}
        borderRadius={GLOBAL_BORDER_RADIUS}
        padding={3}
        fontSize={15}
      >
        {nombreSeccion}
      </Box>
    </>
  )
}