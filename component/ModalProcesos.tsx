import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Box } from "@chakra-ui/react";

import { SistemaOperativo } from "../class/SistemaOperativo";
import { TablaProcesos } from "./TablaProcesos";

// *****************************************************************************************************************************
interface ModalProcesosProps {
  isOpen: boolean;
  onClose: () => void;
  isTerminado: boolean;
  isPausa: boolean;
  setIsPausa: React.Dispatch<React.SetStateAction<boolean>>
  sistemaOperativoActual: SistemaOperativo
}

export const ModalProcesos: React.FC<ModalProcesosProps> = ({ isOpen, onClose, isTerminado, isPausa, setIsPausa, sistemaOperativoActual }) => {
  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); setIsPausa(!isPausa); }} scrollBehavior={'inside'} size={'6xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tabla de Procesos</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
            <TablaProcesos sistemaOperativoActual={sistemaOperativoActual} />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={() => { 
            onClose(); 
            if (isTerminado === false) { setIsPausa(!isPausa); }
          }}>
            Regresar (Tecla C)
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}