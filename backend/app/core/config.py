from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False, extra="ignore")

    app_name: str = "GuruHome"
    environment: str = "development"
    database_url: str = "postgresql+psycopg://guruhome:guruhome@postgres:5432/guruhome"
    redis_url: str = "redis://redis:6379/0"
    secret_key: str = "change-me-super-secret"
    refresh_secret_key: str = "change-me-refresh-secret"
    fernet_key: str = "4t1L-CmvdJ_nK2yP1bIr05oig3NbS1Ry6j3Tz7kRXKU="
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    otp_expire_minutes: int = 5
    backend_cors_origins: List[str] = Field(default_factory=lambda: ["http://localhost:5173", "http://localhost"])
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_from: str = "no-reply@guruhome.in"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

