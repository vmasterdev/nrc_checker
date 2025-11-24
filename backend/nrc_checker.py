import httpx
from bs4 import BeautifulSoup

from models import NrcCheckResult
from config import get_settings

# Ajustar este texto según el mensaje de la página cuando no hay resultados
BUSCADOR_NO_RESULTS_TEXT = "No se encontraron cursos con las palabras"

# Ajustar estos selectores CSS según la estructura real del buscador
SELECTOR_TITULO_CURSO = "h2.titulo-curso"
SELECTOR_PROFESOR = "span.profesor"
SELECTOR_CATEGORIA = "span.categoria"


async def check_nrc(nrc: str) -> NrcCheckResult:
    settings = get_settings()
    url = f"{settings.nrc_search_base_url}?search={nrc}"

    # TODO: Si el buscador requiere autenticación, implementar login aquí usando
    # settings.nrc_search_username y settings.nrc_search_password

    try:
        async with httpx.AsyncClient(timeout=settings.request_timeout_seconds) as client:
            response = await client.get(url)
            response.raise_for_status()
    except httpx.TimeoutException:
        return NrcCheckResult(
            nrc=nrc,
            existe="ERROR",
            mensaje="Timeout al consultar el buscador",
        )
    except httpx.HTTPError as exc:
        return NrcCheckResult(
            nrc=nrc,
            existe="ERROR",
            mensaje=f"Error HTTP: {exc}",
        )
    except Exception as exc:  # noqa: BLE001 - captura de error general para reportar
        return NrcCheckResult(
            nrc=nrc,
            existe="ERROR",
            mensaje=f"Error inesperado: {exc}",
        )

    soup = BeautifulSoup(response.text, "html.parser")

    # Verifica texto de no resultados
    if BUSCADOR_NO_RESULTS_TEXT.lower() in soup.get_text(separator=" ", strip=True).lower():
        return NrcCheckResult(
            nrc=nrc,
            existe="NO",
            mensaje=BUSCADOR_NO_RESULTS_TEXT,
        )

    # Extrae datos con los selectores configurables
    titulo_element = soup.select_one(SELECTOR_TITULO_CURSO)
    profesor_element = soup.select_one(SELECTOR_PROFESOR)
    categoria_element = soup.select_one(SELECTOR_CATEGORIA)

    if titulo_element and profesor_element and categoria_element:
        return NrcCheckResult(
            nrc=nrc,
            existe="SI",
            nombre_curso=titulo_element.get_text(strip=True),
            profesor=profesor_element.get_text(strip=True),
            categoria=categoria_element.get_text(strip=True),
        )

    return NrcCheckResult(
        nrc=nrc,
        existe="ERROR",
        mensaje="No se pudo interpretar la respuesta del buscador",
    )
