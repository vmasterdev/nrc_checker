import React from 'react'

interface FileUploaderProps {
  onFileSelected: (file: File) => void
  disabled?: boolean
  selectedFileName?: string
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelected, disabled, selectedFileName }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileSelected(file)
    }
  }

  return (
    <div className="actions">
      <label className="button" htmlFor="file-input">
        Seleccionar archivo CSV
      </label>
      <input
        id="file-input"
        type="file"
        accept=".csv,text/csv"
        style={{ display: 'none' }}
        disabled={disabled}
        onChange={handleChange}
      />
      <span className="file-info">{selectedFileName || 'Ningún archivo seleccionado'}</span>
    </div>
  )
}

export default FileUploader
