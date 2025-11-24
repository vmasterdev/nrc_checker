# Backend - NRC Checker

## Requisitos previos
- Python 3.11
- Virtualenv recomendado

## Instalación
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
```

## Configuración
1. Copia el archivo `.env.example` a `.env` y ajusta los valores:
   ```bash
   cp .env.example .env
   ```
2. Define la URL real del buscador en `NRC_SEARCH_BASE_URL`.
3. Si el buscador requiere autenticación, completa `NRC_SEARCH_USERNAME` y `NRC_SEARCH_PASSWORD` y ajusta la lógica en `nrc_checker.py`.
4. Ajusta `FRONTEND_ORIGINS` con los orígenes permitidos (separados por comas).

## Ejecución
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

La API quedará disponible en `http://0.0.0.0:8000`.

## Notas
- Los selectores CSS y el texto de "sin resultados" deben actualizarse en `nrc_checker.py` para coincidir con el HTML real del buscador.
