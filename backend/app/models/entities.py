import enum
from datetime import date, datetime

from sqlalchemy import JSON, Boolean, Date, DateTime, Enum, Float, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class UserRole(str, enum.Enum):
    parent = "parent"
    tutor = "tutor"
    admin = "admin"


class ApprovalStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"


class UnlockTarget(str, enum.Enum):
    parent_lead = "parent_lead"
    tutor_lead = "tutor_lead"


class ModeType(str, enum.Enum):
    home = "home"
    online = "online"
    group = "group"
    institute = "institute"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str | None] = mapped_column(String(255), unique=True, index=True, nullable=True)
    phone_encrypted: Mapped[str] = mapped_column(Text)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    full_name: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    parent_profile = relationship("ParentProfile", back_populates="user", uselist=False)
    tutor_profile = relationship("TutorProfile", back_populates="user", uselist=False)


class ParentProfile(Base):
    __tablename__ = "parent_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    city_id: Mapped[int | None] = mapped_column(ForeignKey("cities.id"), nullable=True)
    state_id: Mapped[int | None] = mapped_column(ForeignKey("states.id"), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    area: Mapped[str | None] = mapped_column(String(120), nullable=True)
    pincode: Mapped[str | None] = mapped_column(String(12), nullable=True)
    user = relationship("User", back_populates="parent_profile")


class TutorProfile(Base):
    __tablename__ = "tutor_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    city_id: Mapped[int | None] = mapped_column(ForeignKey("cities.id"), nullable=True)
    area: Mapped[str | None] = mapped_column(String(120), nullable=True)
    experience_years: Mapped[int] = mapped_column(Integer, default=0)
    fees: Mapped[float | None] = mapped_column(Float, nullable=True)
    subjects: Mapped[list[str]] = mapped_column(JSON, default=list)
    class_range: Mapped[str | None] = mapped_column(String(120), nullable=True)
    modes: Mapped[list[str]] = mapped_column(JSON, default=list)
    demo_available: Mapped[bool] = mapped_column(Boolean, default=False)
    profile_photo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    documents: Mapped[list[str]] = mapped_column(JSON, default=list)
    approved_status: Mapped[ApprovalStatus] = mapped_column(Enum(ApprovalStatus), default=ApprovalStatus.pending)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    user = relationship("User", back_populates="tutor_profile")


class ParentLead(Base):
    __tablename__ = "parent_leads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    parent_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    parent_name: Mapped[str] = mapped_column(String(255))
    mobile_encrypted: Mapped[str] = mapped_column(Text)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    child_name: Mapped[str] = mapped_column(String(255))
    class_name: Mapped[str] = mapped_column(String(50))
    board: Mapped[str] = mapped_column(String(100))
    subjects: Mapped[list[str]] = mapped_column(JSON)
    mode: Mapped[ModeType] = mapped_column(Enum(ModeType))
    address: Mapped[str] = mapped_column(Text)
    city: Mapped[str] = mapped_column(String(120))
    area: Mapped[str] = mapped_column(String(120))
    pincode: Mapped[str] = mapped_column(String(12))
    budget: Mapped[float] = mapped_column(Float)
    preferred_time: Mapped[str] = mapped_column(String(255))
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="open")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class TutorLead(Base):
    __tablename__ = "tutor_leads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    tutor_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    tutor_name: Mapped[str] = mapped_column(String(255))
    subjects: Mapped[list[str]] = mapped_column(JSON)
    class_range: Mapped[str] = mapped_column(String(120))
    experience: Mapped[int] = mapped_column(Integer, default=0)
    mode: Mapped[list[str]] = mapped_column(JSON)
    city: Mapped[str] = mapped_column(String(120))
    area: Mapped[str] = mapped_column(String(120))
    fees: Mapped[float] = mapped_column(Float)
    available_time: Mapped[str] = mapped_column(String(255))
    demo_available: Mapped[bool] = mapped_column(Boolean, default=False)
    profile_photo: Mapped[str | None] = mapped_column(String(500), nullable=True)
    documents: Mapped[list[str]] = mapped_column(JSON, default=list)
    approved_status: Mapped[ApprovalStatus] = mapped_column(Enum(ApprovalStatus), default=ApprovalStatus.pending)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class LeadUnlock(Base):
    __tablename__ = "lead_unlocks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    target_type: Mapped[UnlockTarget] = mapped_column(Enum(UnlockTarget))
    target_id: Mapped[int] = mapped_column(Integer)
    payment_id: Mapped[int | None] = mapped_column(ForeignKey("payments.id"), nullable=True)
    unlocked_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    amount: Mapped[float] = mapped_column(Numeric(10, 2))
    purpose: Mapped[str] = mapped_column(String(120))
    status: Mapped[PaymentStatus] = mapped_column(Enum(PaymentStatus), default=PaymentStatus.pending)
    reference: Mapped[str | None] = mapped_column(String(120), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class PaymentProof(Base):
    __tablename__ = "payment_proofs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    payment_id: Mapped[int] = mapped_column(ForeignKey("payments.id"))
    screenshot_url: Mapped[str] = mapped_column(String(500))
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    approved_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    tutor_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    plan_name: Mapped[str] = mapped_column(String(120))
    lead_credits: Mapped[int] = mapped_column(Integer)
    price: Mapped[float] = mapped_column(Float)
    starts_at: Mapped[datetime] = mapped_column(DateTime)
    ends_at: Mapped[datetime] = mapped_column(DateTime)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    parent_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    tutor_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    rating: Mapped[int] = mapped_column(Integer)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    approved: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class OTP(Base):
    __tablename__ = "otp"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    identifier: Mapped[str] = mapped_column(String(255), index=True)
    code: Mapped[str] = mapped_column(String(10))
    purpose: Mapped[str] = mapped_column(String(50))
    expires_at: Mapped[datetime] = mapped_column(DateTime)
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    actor_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    action: Mapped[str] = mapped_column(String(120))
    entity: Mapped[str] = mapped_column(String(120))
    entity_id: Mapped[str] = mapped_column(String(120))
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class City(Base):
    __tablename__ = "cities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    state_id: Mapped[int | None] = mapped_column(ForeignKey("states.id"), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class Subject(Base):
    __tablename__ = "subjects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class State(Base):
    __tablename__ = "states"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    code: Mapped[str] = mapped_column(String(10), unique=True)

