import { MENSAJE_PROGRAMA_TERMINADO } from '../pages';

// *****************************************************************************************************************************
const teclasValidas = ['Enter', 'KeyC', 'KeyP', 'KeyI', 'KeyE', 'KeyT', 'KeyN', 'KeyB'];
export const handleKeyPress = (e: KeyboardEvent, isEvaluado: boolean, isComenzado: boolean, setIsComenzado: React.Dispatch<React.SetStateAction<boolean>>, 
    isPausa: boolean,  setIsPausa: React.Dispatch<React.SetStateAction<boolean>>, onClose: () => void, 
    isInterrupcion: boolean, setIsInterrupcion: React.Dispatch<React.SetStateAction<boolean>>, 
    handleError: () => void, setMensaje: React.Dispatch<React.SetStateAction<string>>, 
    isTerminado: boolean, setIsTerminado: React.Dispatch<React.SetStateAction<boolean>>, 
    isNuevoProceso: boolean, setIsNuevoProceso: React.Dispatch<React.SetStateAction<boolean>>, 
    onOpen: ()=>void
    ) => {
      if (!teclasValidas.includes(e.code)) { return; }

      /*else*/
      if (e.code === 'KeyC') {
        e.preventDefault();

        if (isTerminado === true) {
          onClose();
          return;
        }
        
        if (isEvaluado === false) { /*no se ha evaluado el programa todavía*/
          return;
        }

        if (isComenzado === false) { /*primera ejecución del programa*/
          setIsComenzado(!isComenzado);
          return;
        }
        
        if (isComenzado === true && isPausa === true) { /*regresando de la tabla de procesos*/
          onClose();
          setIsPausa(!isPausa);
        }
        
        
        else { return; } /*ninguno de los casos anteriores*/
      }

      if (e.code === 'KeyP') { 
        e.preventDefault(); 
        if (isComenzado === true) { 
          setIsPausa(!isPausa); 
          return; 
        } else { return; } 
      }

      if (e.code === 'KeyI') {
        e.preventDefault();
        if (isComenzado === true && isInterrupcion === false) {
          setIsInterrupcion(!isInterrupcion);
          return;
        } else { return; }
      }

      if (e.code === 'KeyE') { 
        e.preventDefault(); 
        if (isComenzado === true) { 
          handleError(); 
          setMensaje('Si hay un proceso en ejecución y la memoria está llena, será marcado como error.'); 
        } else { 
          return; 
        } 
      }

      if (e.code === 'KeyT') { 
        e.preventDefault(); 
        if (isTerminado === true ) { /*abriendo y cerrando después de que el programa terminó*/
          onOpen();
          return;
        }
        if (isComenzado === true) { 
          setIsTerminado(!isTerminado); 
          setMensaje(MENSAJE_PROGRAMA_TERMINADO); } 
          else { return;  } 
      }

      if (e.code === 'KeyN') { 
        e.preventDefault(); 
        if (isComenzado === true) { 
          setIsNuevoProceso(!isNuevoProceso); 
          setMensaje('Agregando Proceso...'); 
        } else { return; } 
      }

      if (e.code === 'KeyB') {
        e.preventDefault();

        if (isTerminado === true ) { /*abriendo y cerrando después de que el programa terminó*/
          onOpen();
          return;
        }

        if (isComenzado === true) {
          if (isPausa === true) { return; } /*ignorar mientras la tabla de procesos está abierta porque se cierra con C*/

          setIsPausa(!isPausa); /*caso normal, se abre la tabla de procesos*/
          onOpen();

        } else { return; }
      }
}