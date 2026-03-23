from datetime import UTC, datetime

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import LeadUnlock, ParentLead, Payment, PaymentProof, PaymentStatus, TutorLead, UnlockTarget, User
from app.services.audit import log_action


def create_payment(db: Session, user: User, amount: float, purpose: str) -> Payment:
    payment = Payment(user_id=user.id, amount=amount, purpose=purpose)
    db.add(payment)
    db.commit()
    db.refresh(payment)
    log_action(db, user.id, "payment_created", "payment", str(payment.id), {"amount": amount, "purpose": purpose})
    return payment


def attach_payment_proof(db: Session, user: User, payment_id: int, screenshot_url: str, note: str | None) -> PaymentProof:
    payment = db.get(Payment, payment_id)
    if not payment or payment.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")

    proof = PaymentProof(payment_id=payment.id, screenshot_url=screenshot_url, note=note)
    db.add(proof)
    db.commit()
    db.refresh(proof)
    log_action(db, user.id, "payment_proof_uploaded", "payment_proof", str(proof.id), {"payment_id": payment.id})
    return proof


def review_payment(
    db: Session,
    admin: User,
    payment_id: int,
    new_status: PaymentStatus,
    reference: str | None = None,
) -> Payment:
    payment = db.get(Payment, payment_id)
    if not payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")

    payment.status = new_status
    payment.reference = reference
    proof = db.scalar(select(PaymentProof).where(PaymentProof.payment_id == payment.id))
    if proof:
        proof.approved_by = admin.id
        proof.reviewed_at = datetime.now(UTC)
        db.add(proof)
    db.add(payment)
    db.commit()
    db.refresh(payment)
    log_action(db, admin.id, "payment_reviewed", "payment", str(payment.id), {"status": new_status.value})
    return payment


def unlock_target(db: Session, user: User, target_type: UnlockTarget, target_id: int, payment_id: int) -> LeadUnlock:
    payment = db.get(Payment, payment_id)
    if not payment or payment.user_id != user.id or payment.status != PaymentStatus.verified:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Verified payment required before unlock")

    if target_type == UnlockTarget.parent_lead:
        target = db.get(ParentLead, target_id)
        if not target:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    else:
        target = db.get(TutorLead, target_id)
        if not target:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tutor lead not found")

    existing = db.scalar(
        select(LeadUnlock).where(
            LeadUnlock.user_id == user.id,
            LeadUnlock.target_type == target_type,
            LeadUnlock.target_id == target_id,
        )
    )
    if existing:
        return existing

    unlock = LeadUnlock(user_id=user.id, target_type=target_type, target_id=target_id, payment_id=payment_id)
    db.add(unlock)
    db.commit()
    db.refresh(unlock)
    log_action(db, user.id, "lead_unlocked", target_type.value, str(target_id), {"payment_id": payment_id})
    return unlock


def analytics_summary(db: Session) -> dict:
    return {
        "users": db.scalar(select(func.count(User.id))) or 0,
        "payments": db.scalar(select(func.count(Payment.id))) or 0,
        "verified_payments": db.scalar(select(func.count(Payment.id)).where(Payment.status == PaymentStatus.verified)) or 0,
        "parent_leads": db.scalar(select(func.count(ParentLead.id))) or 0,
        "tutor_leads": db.scalar(select(func.count(TutorLead.id))) or 0,
        "lead_unlocks": db.scalar(select(func.count(LeadUnlock.id))) or 0,
    }

