import { Button } from '@chakra-ui/react';

import { GLOBAL_BORDER_RADIUS, GLOBAL_SECONDARY_COLOR } from '../pages/index';

// ********************************************************************************
export interface BotonProps {
    contenido: string;
    width: string;
    callback: <T>(t: T) => void;
}

export const Boton: React.FC<BotonProps> = ({ contenido, width, callback }) => {
    return (
        <Button
            width={width}
            borderRadius={GLOBAL_BORDER_RADIUS}
            padding={5}
            bg={GLOBAL_SECONDARY_COLOR}
            onClick={callback}
        >
            {contenido}
        </Button>
    )
}