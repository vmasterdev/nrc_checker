from typing import Literal
from pydantic import BaseModel, Field


class NrcRequest(BaseModel):
    nrc: str = Field(..., description="Código NRC a consultar")


class NrcCheckResult(BaseModel):
    nrc: str
    existe: Literal["SI", "NO", "ERROR"]
    nombre_curso: str = ""
    profesor: str = ""
    categoria: str = ""
    mensaje: str = ""
