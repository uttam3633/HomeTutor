from datetime import UTC, datetime, timedelta
from typing import Any

from cryptography.fernet import Fernet
from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
fernet = Fernet(settings.fernet_key.encode())


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(subject: str, role: str) -> str:
    expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    expire = datetime.now(UTC) + expires_delta
    payload: dict[str, Any] = {"sub": subject, "role": role, "exp": expire, "type": "access"}
    return jwt.encode(payload, settings.secret_key, algorithm="HS256")


def create_refresh_token(subject: str, role: str) -> str:
    expires_delta = timedelta(days=settings.refresh_token_expire_days)
    expire = datetime.now(UTC) + expires_delta
    payload: dict[str, Any] = {"sub": subject, "role": role, "exp": expire, "type": "refresh"}
    return jwt.encode(payload, settings.refresh_secret_key, algorithm="HS256")


def encrypt_phone(phone: str) -> str:
    return fernet.encrypt(phone.encode()).decode()


def decrypt_phone(token: str) -> str:
    return fernet.decrypt(token.encode()).decode()

