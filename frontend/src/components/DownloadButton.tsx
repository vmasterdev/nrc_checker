import React from 'react'
import Papa from 'papaparse'
import { ResultadoNRC } from '../types/nrc'

interface DownloadButtonProps {
  resultados: ResultadoNRC[]
  disabled?: boolean
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ resultados, disabled }) => {
  const handleDownload = () => {
    if (!resultados.length) return
    const csv = Papa.unparse(
      resultados.map((item) => ({
        NRC: item.nrc,
        Existe: item.existe,
        NombreCurso: item.nombre_curso,
        Profesor: item.profesor,
        Categoria: item.categoria,
        Mensaje: item.mensaje,
      }))
    )

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'resultados_nrc.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button className="button secondary" onClick={handleDownload} disabled={disabled}>
      Descargar resultados (.csv)
    </button>
  )
}

export default DownloadButton
