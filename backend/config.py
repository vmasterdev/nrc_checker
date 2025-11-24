from functools import lru_cache
from typing import List

from dotenv import load_dotenv
from pydantic import BaseModel, Field
import os


load_dotenv()


class Settings(BaseModel):
    nrc_search_base_url: str = Field(..., alias="NRC_SEARCH_BASE_URL")
    request_timeout_seconds: float = Field(15, alias="REQUEST_TIMEOUT_SECONDS")
    frontend_origins: List[str] = Field(default_factory=lambda: ["http://localhost:5173"], alias="FRONTEND_ORIGINS")
    nrc_search_username: str | None = Field(default=None, alias="NRC_SEARCH_USERNAME")
    nrc_search_password: str | None = Field(default=None, alias="NRC_SEARCH_PASSWORD")

    class Config:
        populate_by_name = True


@lru_cache
def get_settings() -> Settings:
    # FRONTEND_ORIGINS puede venir separada por comas
    raw_origins = os.getenv("FRONTEND_ORIGINS", "http://localhost:5173")
    origins_list = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
    settings = Settings(
        NRC_SEARCH_BASE_URL=os.getenv("NRC_SEARCH_BASE_URL", "http://localhost:8000"),
        REQUEST_TIMEOUT_SECONDS=float(os.getenv("REQUEST_TIMEOUT_SECONDS", "15")),
        FRONTEND_ORIGINS=origins_list,
        NRC_SEARCH_USERNAME=os.getenv("NRC_SEARCH_USERNAME"),
        NRC_SEARCH_PASSWORD=os.getenv("NRC_SEARCH_PASSWORD"),
    )
    return settings
