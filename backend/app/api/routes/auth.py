from datetime import UTC, datetime

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.limiter import limiter
from app.core.security import decrypt_phone
from app.db.session import get_db
from app.schemas.auth import LoginRequest, OTPRequest, OTPVerifyRequest, RegisterRequest, TokenResponse
from app.schemas.common import UserOut
from app.services.auth import authenticate_user, create_otp, issue_tokens, register_user, verify_otp

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
@limiter.limit("5/minute")
def register(request: Request, payload: RegisterRequest, db: Session = Depends(get_db)):
    user = register_user(db, payload.full_name, payload.email, payload.phone, payload.password, payload.role)
    user.last_login_at = datetime.now(UTC)
    db.add(user)
    db.commit()
    return issue_tokens(user)


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
def login(request: Request, payload: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.email, payload.phone, payload.password)
    user.last_login_at = datetime.now(UTC)
    db.add(user)
    db.commit()
    return issue_tokens(user)


@router.post("/otp/request")
@limiter.limit("5/minute")
def request_otp(request: Request, payload: OTPRequest, db: Session = Depends(get_db)):
    otp = create_otp(db, payload.identifier, payload.purpose)
    return {"message": "OTP generated", "dev_code": otp.code}


@router.post("/otp/verify", response_model=TokenResponse)
@limiter.limit("10/minute")
def verify_mobile_otp(request: Request, payload: OTPVerifyRequest, db: Session = Depends(get_db)):
    user = verify_otp(db, payload.identifier, payload.code, payload.role)
    return issue_tokens(user)


@router.get("/me", response_model=UserOut)
def me(current_user=Depends(get_current_user)):
    return UserOut(
        id=current_user.id,
        full_name=current_user.full_name,
        email=current_user.email,
        phone=decrypt_phone(current_user.phone_encrypted),
        role=current_user.role,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
    )

