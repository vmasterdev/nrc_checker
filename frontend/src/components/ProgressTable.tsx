import React from 'react'
import { ResultadoNRC } from '../types/nrc'

interface ProgressTableProps {
  resultados: ResultadoNRC[]
}

const ProgressTable: React.FC<ProgressTableProps> = ({ resultados }) => {
  if (!resultados.length) return null

  const badgeClass = (estado: string) => {
    if (estado === 'SI') return 'badge si'
    if (estado === 'NO') return 'badge no'
    return 'badge error'
  }

  return (
    <div className="card">
      <h3>Resultados</h3>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>NRC</th>
              <th>Existe</th>
              <th>NombreCurso</th>
              <th>Profesor</th>
              <th>Categoria</th>
              <th>Mensaje</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((item) => (
              <tr key={item.nrc}>
                <td>{item.nrc}</td>
                <td>
                  <span className={badgeClass(item.existe)}>{item.existe}</span>
                </td>
                <td>{item.nombre_curso}</td>
                <td>{item.profesor}</td>
                <td>{item.categoria}</td>
                <td>{item.mensaje}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProgressTable
