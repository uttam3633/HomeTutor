from pydantic import BaseModel, EmailStr, Field

from app.models import UserRole


class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    email: EmailStr | None = None
    phone: str = Field(min_length=10, max_length=15)
    password: str = Field(min_length=8, max_length=64)
    role: UserRole


class LoginRequest(BaseModel):
    email: EmailStr | None = None
    phone: str | None = None
    password: str = Field(min_length=8, max_length=64)


class OTPRequest(BaseModel):
    identifier: str
    purpose: str = "login"


class OTPVerifyRequest(BaseModel):
    identifier: str
    code: str = Field(min_length=4, max_length=6)
    role: UserRole = UserRole.parent


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    role: UserRole

