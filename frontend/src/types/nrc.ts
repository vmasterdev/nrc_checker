export type EstadoNRC = 'SI' | 'NO' | 'ERROR'

export interface ResultadoNRC {
  nrc: string
  existe: EstadoNRC
  nombre_curso: string
  profesor: string
  categoria: string
  mensaje: string
}
