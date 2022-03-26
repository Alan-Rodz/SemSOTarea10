import { Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot } from "@chakra-ui/react"
import { SistemaOperativo } from "../class/SistemaOperativo"

// *****************************************************************************************************************************
interface TablaProcesosProps {
  sistemaOperativoActual: SistemaOperativo
}

export const TablaProcesos: React.FC<TablaProcesosProps> = ({ sistemaOperativoActual }) => {
  const todosLosProcesos = sistemaOperativoActual.getTodosLosProcesos();

  return (
    <Table variant='simple'>
      <TableCaption>Tabla de los Procesos en el Sistema</TableCaption>
      <Thead>
        <Tr>
          <Th>Identificador del Proceso</Th>
          <Th>Estado del Proceso</Th>
          <Th>Operación</Th>
          <Th>Operando1</Th>
          <Th>Operando2</Th>
          <Th>Resultado</Th>
          <Th>Tiempo De Llegada</Th>
          <Th>Tiempo De Finalización</Th>
          <Th>Tiempo De Retorno</Th>
          <Th>Tiempo De Espera</Th>
          <Th>Tiempo De Servicio</Th>
          <Th>Tiempo Restante</Th>
          <Th>Tiempo De Respuesta</Th>
        </Tr>
      </Thead>

      <Tbody>
        {todosLosProcesos.map((proceso, index) =>
            <Tr key={index}>
              <Td>{proceso.ID}</Td>
              <Td>{proceso.estado}</Td>
              <Td>{proceso.operacion}</Td>
              <Td>{proceso.operando1}</Td>
              <Td>{proceso.operando2}</Td>
              {proceso.estado === 'Terminado' ? <Td>{proceso.resultado}</Td> : <Td>{'Calculándose...'}</Td>}
              <Td>{proceso.tiempoLlegada}</Td>

              {proceso.tiempoFinalizacion === 0 ?<Td>{'No Finalizado Todavía'}</Td> : <Td>{proceso.tiempoFinalizacion}</Td>}
              {proceso.tiempoRetorno === 0 ?<Td>{'No Calculado Todavía'}</Td> : <Td>{proceso.tiempoRetorno}</Td>}

              <Td>{proceso.tiempoEspera}</Td>
              <Td>{proceso.tiempoServicio}</Td>
              <Td>{proceso.tiempoRestante}</Td>
              <Td>{proceso.tiempoRespuesta}</Td>
            </Tr>
        )}
      </Tbody>
    </Table>
  )
}