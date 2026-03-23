from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.db.session import get_db
from app.models import LeadUnlock, ParentLead, Payment, Review, UnlockTarget, User, UserRole
from app.schemas.common import ParentLeadCreate, PaymentCreate, PaymentOut, PaymentProofCreate, ReviewCreate
from app.services.audit import log_action
from app.services.payments import attach_payment_proof, create_payment, unlock_target
from app.utils.sanitize import sanitize_text

router = APIRouter()


@router.post("/requirements")
def create_requirement(
    payload: ParentLeadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.parent)),
):
    lead = ParentLead(
        parent_id=current_user.id,
        parent_name=sanitize_text(payload.parent_name) or current_user.full_name,
        mobile_encrypted=current_user.phone_encrypted if payload.mobile else current_user.phone_encrypted,
        email=payload.email,
        child_name=sanitize_text(payload.child_name) or "",
        class_name=sanitize_text(payload.class_name) or "",
        board=sanitize_text(payload.board) or "",
        subjects=[sanitize_text(subject) or "" for subject in payload.subjects],
        mode=payload.mode,
        address=sanitize_text(payload.address) or "",
        city=sanitize_text(payload.city) or "",
        area=sanitize_text(payload.area) or "",
        pincode=sanitize_text(payload.pincode) or "",
        budget=payload.budget,
        preferred_time=sanitize_text(payload.preferred_time) or "",
        start_date=payload.start_date,
        notes=sanitize_text(payload.notes),
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    log_action(db, current_user.id, "parent_requirement_created", "parent_lead", str(lead.id))
    return lead


@router.get("/dashboard")
def parent_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.parent)),
):
    my_leads = db.scalars(select(ParentLead).where(ParentLead.parent_id == current_user.id).order_by(desc(ParentLead.created_at))).all()
    my_unlocks = db.scalars(select(LeadUnlock).where(LeadUnlock.user_id == current_user.id, LeadUnlock.target_type == UnlockTarget.tutor_lead)).all()
    my_payments = db.scalars(select(Payment).where(Payment.user_id == current_user.id).order_by(desc(Payment.created_at)).limit(10)).all()
    return {
        "stats": {
            "requirements": len(my_leads),
            "unlocks": len(my_unlocks),
            "payments": len(my_payments),
        },
        "requirements": my_leads,
        "payments": my_payments,
    }


@router.post("/unlock/payment", response_model=PaymentOut)
def initiate_unlock_payment(
    payload: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.parent)),
):
    if payload.target_type != UnlockTarget.tutor_lead:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Parents can only unlock tutor contacts")
    payment = create_payment(db, current_user, payload.amount, payload.purpose)
    return PaymentOut(id=payment.id, amount=float(payment.amount), purpose=payment.purpose, status=payment.status, created_at=payment.created_at)


@router.post("/payment-proof")
def upload_payment_proof(
    payload: PaymentProofCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.parent)),
):
    return attach_payment_proof(db, current_user, payload.payment_id, payload.screenshot_url, sanitize_text(payload.note))


@router.post("/unlock/{tutor_lead_id}")
def unlock_tutor_contact(
    tutor_lead_id: int,
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.parent)),
):
    unlock = unlock_target(db, current_user, UnlockTarget.tutor_lead, tutor_lead_id, payment_id)
    return {"message": "Tutor contact unlocked", "unlock_id": unlock.id}


@router.post("/reviews")
def create_review(
    payload: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.parent)),
):
    review = Review(
        parent_id=current_user.id,
        tutor_id=payload.tutor_id,
        rating=payload.rating,
        comment=sanitize_text(payload.comment),
        approved=False,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    log_action(db, current_user.id, "review_created", "review", str(review.id))
    return review

