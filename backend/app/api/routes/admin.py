from fastapi import APIRouter, Depends
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.db.session import get_db
from app.models import ApprovalStatus, AuditLog, City, Payment, Review, Subject, TutorLead, TutorProfile, User, UserRole
from app.schemas.common import ApprovalUpdate, PaymentReview
from app.services.audit import log_action
from app.services.payments import analytics_summary, review_payment
from app.utils.sanitize import sanitize_text

router = APIRouter()


@router.get("/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.admin)),
):
    return {
        "analytics": analytics_summary(db),
        "recent_payments": db.scalars(select(Payment).order_by(desc(Payment.created_at)).limit(10)).all(),
        "pending_tutors": db.scalars(select(TutorProfile).where(TutorProfile.approved_status == ApprovalStatus.pending)).all(),
        "pending_leads": db.scalars(select(TutorLead).where(TutorLead.approved_status == ApprovalStatus.pending)).all(),
    }


@router.patch("/tutors/{profile_id}/approval")
def review_tutor(
    profile_id: int,
    payload: ApprovalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.admin)),
):
    profile = db.get(TutorProfile, profile_id)
    if not profile:
        return {"message": "Tutor profile not found"}
    profile.approved_status = payload.status
    db.add(profile)
    db.commit()
    log_action(db, current_user.id, "tutor_profile_reviewed", "tutor_profile", str(profile_id), {"status": payload.status.value})
    return profile


@router.patch("/availabilities/{lead_id}/approval")
def review_availability(
    lead_id: int,
    payload: ApprovalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.admin)),
):
    lead = db.get(TutorLead, lead_id)
    if not lead:
        return {"message": "Tutor availability not found"}
    lead.approved_status = payload.status
    db.add(lead)
    db.commit()
    log_action(db, current_user.id, "tutor_lead_reviewed", "tutor_lead", str(lead_id), {"status": payload.status.value})
    return lead


@router.patch("/payments/{payment_id}")
def review_user_payment(
    payment_id: int,
    payload: PaymentReview,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.admin)),
):
    return review_payment(db, current_user, payment_id, payload.status, payload.reference)


@router.patch("/users/{user_id}/block")
def block_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.admin)),
):
    user = db.get(User, user_id)
    if not user:
        return {"message": "User not found"}
    user.is_active = False
    db.add(user)
    db.commit()
    log_action(db, current_user.id, "user_blocked", "user", str(user_id))
    return {"message": "User blocked"}


@router.post("/cities")
def create_city(
    name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.admin)),
):
    city = City(name=sanitize_text(name) or "")
    db.add(city)
    db.commit()
    db.refresh(city)
    return city


@router.post("/subjects")
def create_subject(
    name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.admin)),
):
    subject = Subject(name=sanitize_text(name) or "")
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject


@router.patch("/reviews/{review_id}/approve")
def approve_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.admin)),
):
    review = db.get(Review, review_id)
    if not review:
        return {"message": "Review not found"}
    review.approved = True
    db.add(review)
    db.commit()
    return review


@router.get("/audit-logs")
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.admin)),
):
    return db.scalars(select(AuditLog).order_by(desc(AuditLog.created_at)).limit(100)).all()

