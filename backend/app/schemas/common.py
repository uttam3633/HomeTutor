from datetime import date, datetime

from pydantic import BaseModel, EmailStr, Field

from app.models import ApprovalStatus, ModeType, PaymentStatus, UnlockTarget, UserRole


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr | None
    phone: str
    role: UserRole
    is_active: bool
    is_verified: bool


class ParentLeadCreate(BaseModel):
    parent_name: str
    mobile: str
    email: EmailStr | None = None
    child_name: str
    class_name: str
    board: str
    subjects: list[str]
    mode: ModeType
    address: str
    city: str
    area: str
    pincode: str
    budget: float
    preferred_time: str
    start_date: date | None = None
    notes: str | None = Field(default=None, max_length=1000)


class TutorLeadCreate(BaseModel):
    tutor_name: str
    subjects: list[str]
    class_range: str
    experience: int = Field(ge=0, le=60)
    mode: list[str]
    city: str
    area: str
    fees: float
    available_time: str
    demo_available: bool = False
    profile_photo: str | None = None
    documents: list[str] = Field(default_factory=list)


class PaymentCreate(BaseModel):
    amount: float
    purpose: str
    target_type: UnlockTarget
    target_id: int


class PaymentProofCreate(BaseModel):
    payment_id: int
    screenshot_url: str
    note: str | None = None


class ReviewCreate(BaseModel):
    tutor_id: int
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class DashboardStat(BaseModel):
    label: str
    value: int | float | str


class PaymentOut(BaseModel):
    id: int
    amount: float
    purpose: str
    status: PaymentStatus
    created_at: datetime


class ApprovalUpdate(BaseModel):
    status: ApprovalStatus


class PaymentReview(BaseModel):
    status: PaymentStatus
    reference: str | None = None
