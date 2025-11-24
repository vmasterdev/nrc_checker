import React, { useCallback, useMemo, useState } from 'react'
import Papa from 'papaparse'
import FileUploader from './components/FileUploader'
import ProgressTable from './components/ProgressTable'
import DownloadButton from './components/DownloadButton'
import { ResultadoNRC } from './types/nrc'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [archivo, setArchivo] = useState<File | null>(null)
  const [errorMensaje, setErrorMensaje] = useState<string>('')
  const [resultados, setResultados] = useState<ResultadoNRC[]>([])
  const [procesando, setProcesando] = useState(false)

  const nrcPendientes = useMemo(() => resultados.length, [resultados])

  const leerCSV = (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const nrcList: string[] = []
          results.data.forEach((row: any) => {
            const valor = row['NRC']?.toString().trim()
            if (valor) nrcList.push(valor)
          })
          if (!results.meta.fields?.includes('NRC')) {
            reject(new Error('El CSV no tiene la columna NRC'))
            return
          }
          resolve(nrcList)
        },
        error: (err) => reject(err),
      })
    })
  }

  const procesarNrcs = useCallback(
    async (nrcs: string[]) => {
      setResultados([])
      setErrorMensaje('')
      setProcesando(true)

      const nuevosResultados: ResultadoNRC[] = []

      for (const nrc of nrcs) {
        try {
          const respuesta = await fetch(`${API_URL}/check-nrc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nrc }),
          })

          if (!respuesta.ok) {
            throw new Error('Respuesta no exitosa del servidor')
          }

          const data = (await respuesta.json()) as ResultadoNRC
          nuevosResultados.push(data)
          setResultados([...nuevosResultados])
        } catch (error) {
          nuevosResultados.push({
            nrc,
            existe: 'ERROR',
            nombre_curso: '',
            profesor: '',
            categoria: '',
            mensaje: 'Error al llamar a la API',
          })
          setResultados([...nuevosResultados])
        }
      }

      setProcesando(false)
    },
    []
  )

  const handleStart = async () => {
    if (!archivo) return
    try {
      const nrcs = await leerCSV(archivo)
      if (!nrcs.length) {
        setErrorMensaje('El archivo no contiene NRC válidos')
        return
      }
      await procesarNrcs(nrcs)
    } catch (error: any) {
      setErrorMensaje(error.message || 'Error al leer el archivo CSV')
      setProcesando(false)
    }
  }

  return (
    <div className="app-container">
      <header className="card">
        <h1 className="title">NRC Checker</h1>
        <p>Sube un CSV con la columna NRC y valida los resultados desde el buscador.</p>
      </header>

      <section className="card">
        <FileUploader
          onFileSelected={(file) => {
            setArchivo(file)
            setErrorMensaje('')
          }}
          disabled={procesando}
          selectedFileName={archivo?.name}
        />

        <div className="actions" style={{ marginTop: '1rem' }}>
          <button className="button" onClick={handleStart} disabled={!archivo || procesando}>
            {procesando ? 'Procesando...' : 'Iniciar revisión'}
          </button>
          <div>
            <div className="progress">
              Procesados {nrcPendientes} NRC
            </div>
            {errorMensaje && <div className="error">{errorMensaje}</div>}
          </div>
        </div>
      </section>

      <ProgressTable resultados={resultados} />

      <div className="card">
        <DownloadButton resultados={resultados} disabled={procesando || resultados.length === 0} />
      </div>
    </div>
  )
}

export default App
