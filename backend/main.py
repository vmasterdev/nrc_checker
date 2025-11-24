from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from models import NrcRequest, NrcCheckResult
from nrc_checker import check_nrc

settings = get_settings()

app = FastAPI(title="NRC Checker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_origins + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/check-nrc", response_model=NrcCheckResult)
async def check_nrc_endpoint(payload: NrcRequest) -> NrcCheckResult:
    return await check_nrc(payload.nrc)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
