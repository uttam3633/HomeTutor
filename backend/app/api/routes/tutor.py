from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.db.session import get_db
from app.models import ApprovalStatus, LeadUnlock, Payment, Subscription, TutorLead, TutorProfile, UnlockTarget, User, UserRole
from app.schemas.common import PaymentCreate, PaymentOut, PaymentProofCreate, TutorLeadCreate
from app.services.audit import log_action
from app.services.payments import attach_payment_proof, create_payment, unlock_target
from app.utils.sanitize import sanitize_text

router = APIRouter()


@router.post("/profile")
def upsert_profile(
    payload: TutorLeadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.tutor)),
):
    profile = db.scalar(select(TutorProfile).where(TutorProfile.user_id == current_user.id))
    if not profile:
        profile = TutorProfile(user_id=current_user.id)
    profile.bio = f"{payload.experience} years experience in {', '.join(payload.subjects)}"
    profile.area = sanitize_text(payload.area)
    profile.experience_years = payload.experience
    profile.fees = payload.fees
    profile.subjects = [sanitize_text(subject) or "" for subject in payload.subjects]
    profile.class_range = sanitize_text(payload.class_range)
    profile.modes = [sanitize_text(mode) or "" for mode in payload.mode]
    profile.demo_available = payload.demo_available
    profile.profile_photo_url = payload.profile_photo
    profile.documents = payload.documents
    db.add(profile)
    db.commit()
    db.refresh(profile)
    log_action(db, current_user.id, "tutor_profile_upserted", "tutor_profile", str(profile.id))
    return profile


@router.post("/availability")
def create_availability(
    payload: TutorLeadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.tutor)),
):
    lead = TutorLead(
        tutor_id=current_user.id,
        tutor_name=sanitize_text(payload.tutor_name) or current_user.full_name,
        subjects=[sanitize_text(subject) or "" for subject in payload.subjects],
        class_range=sanitize_text(payload.class_range) or "",
        experience=payload.experience,
        mode=[sanitize_text(mode) or "" for mode in payload.mode],
        city=sanitize_text(payload.city) or "",
        area=sanitize_text(payload.area) or "",
        fees=payload.fees,
        available_time=sanitize_text(payload.available_time) or "",
        demo_available=payload.demo_available,
        profile_photo=payload.profile_photo,
        documents=payload.documents,
        approved_status=ApprovalStatus.pending,
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    log_action(db, current_user.id, "tutor_availability_created", "tutor_lead", str(lead.id))
    return lead


@router.get("/dashboard")
def tutor_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.tutor)),
):
    profile = db.scalar(select(TutorProfile).where(TutorProfile.user_id == current_user.id))
    leads = db.scalars(select(TutorLead).where(TutorLead.tutor_id == current_user.id).order_by(desc(TutorLead.created_at))).all()
    unlocks = db.scalars(select(LeadUnlock).where(LeadUnlock.user_id == current_user.id, LeadUnlock.target_type == UnlockTarget.parent_lead)).all()
    payments = db.scalars(select(Payment).where(Payment.user_id == current_user.id).order_by(desc(Payment.created_at)).limit(10)).all()
    subscription = db.scalar(select(Subscription).where(Subscription.tutor_id == current_user.id, Subscription.is_active.is_(True)))
    return {
        "stats": {
            "availabilities": len(leads),
            "unlocks": len(unlocks),
            "payments": len(payments),
        },
        "profile": profile,
        "availabilities": leads,
        "subscription": subscription,
        "payments": payments,
    }


@router.post("/unlock/payment", response_model=PaymentOut)
def initiate_unlock_payment(
    payload: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.tutor)),
):
    if payload.target_type != UnlockTarget.parent_lead:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tutors can only unlock parent requirements")
    payment = create_payment(db, current_user, payload.amount, payload.purpose)
    return PaymentOut(id=payment.id, amount=float(payment.amount), purpose=payment.purpose, status=payment.status, created_at=payment.created_at)


@router.post("/payment-proof")
def upload_payment_proof(
    payload: PaymentProofCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.tutor)),
):
    return attach_payment_proof(db, current_user, payload.payment_id, payload.screenshot_url, sanitize_text(payload.note))


@router.post("/unlock/{parent_lead_id}")
def unlock_parent_contact(
    parent_lead_id: int,
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.tutor)),
):
    unlock = unlock_target(db, current_user, UnlockTarget.parent_lead, parent_lead_id, payment_id)
    return {"message": "Parent contact unlocked", "unlock_id": unlock.id}


@router.post("/subscriptions/buy")
def buy_subscription(
    plan_name: str,
    lead_credits: int,
    price: float,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.tutor)),
):
    active_subscription = db.scalar(select(Subscription).where(Subscription.tutor_id == current_user.id, Subscription.is_active.is_(True)))
    if active_subscription:
        active_subscription.is_active = False
        db.add(active_subscription)
    subscription = Subscription(
        tutor_id=current_user.id,
        plan_name=plan_name,
        lead_credits=lead_credits,
        price=price,
        starts_at=datetime.now(UTC),
        ends_at=datetime.now(UTC) + timedelta(days=30),
        is_active=True,
    )
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    log_action(db, current_user.id, "subscription_bought", "subscription", str(subscription.id))
    return subscription

