import random
from datetime import UTC, datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decrypt_phone,
    encrypt_phone,
    hash_password,
    verify_password,
)
from app.models import OTP, ParentProfile, TutorProfile, User, UserRole


def register_user(db: Session, full_name: str, email: str | None, phone: str, password: str, role: UserRole) -> User:
    existing_by_email = db.scalar(select(User).where(User.email == email)) if email else None
    users = db.scalars(select(User)).all()
    existing_by_phone = next((candidate for candidate in users if decrypt_phone(candidate.phone_encrypted) == phone), None)
    if existing_by_email or existing_by_phone:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email or phone already registered")

    user = User(
        full_name=full_name,
        email=email,
        phone_encrypted=encrypt_phone(phone),
        password_hash=hash_password(password),
        role=role,
        is_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    if role == UserRole.parent:
        db.add(ParentProfile(user_id=user.id))
    elif role == UserRole.tutor:
        db.add(TutorProfile(user_id=user.id))
    db.commit()
    return user


def authenticate_user(db: Session, email: str | None, phone: str | None, password: str) -> User:
    user = None
    if email:
        user = db.scalar(select(User).where(User.email == email))
    elif phone:
        users = db.scalars(select(User)).all()
        user = next((candidate for candidate in users if decrypt_phone(candidate.phone_encrypted) == phone), None)

    if not user or not user.password_hash or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return user


def issue_tokens(user: User) -> dict:
    return {
        "access_token": create_access_token(str(user.id), user.role.value),
        "refresh_token": create_refresh_token(str(user.id), user.role.value),
        "role": user.role,
    }


def create_otp(db: Session, identifier: str, purpose: str) -> OTP:
    code = f"{random.randint(1000, 999999):04d}"
    otp = OTP(
        identifier=identifier,
        code=code,
        purpose=purpose,
        expires_at=datetime.now(UTC) + timedelta(minutes=settings.otp_expire_minutes),
    )
    db.add(otp)
    db.commit()
    db.refresh(otp)
    return otp


def verify_otp(db: Session, identifier: str, code: str, role: UserRole) -> User:
    otp = db.scalar(select(OTP).where(OTP.identifier == identifier, OTP.code == code, OTP.verified.is_(False)).order_by(OTP.created_at.desc()))
    if not otp or otp.expires_at < datetime.now(UTC):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP invalid or expired")

    otp.verified = True
    db.add(otp)

    users = db.scalars(select(User)).all()
    matched_user = next((candidate for candidate in users if decrypt_phone(candidate.phone_encrypted) == identifier), None)
    if not matched_user:
        matched_user = User(
            full_name="New User",
            email=None,
            phone_encrypted=encrypt_phone(identifier),
            password_hash=None,
            role=role,
            is_verified=True,
        )
        db.add(matched_user)
        db.flush()
        if role == UserRole.parent:
            db.add(ParentProfile(user_id=matched_user.id))
        elif role == UserRole.tutor:
            db.add(TutorProfile(user_id=matched_user.id))

    matched_user.is_verified = True
    matched_user.last_login_at = datetime.now(UTC)
    db.commit()
    db.refresh(matched_user)
    return matched_user
