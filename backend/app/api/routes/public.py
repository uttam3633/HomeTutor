from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from fastapi import APIRouter, Depends, Query

from app.db.session import get_db
from app.models import ApprovalStatus, City, ParentLead, Review, Subject, TutorLead, TutorProfile, User

router = APIRouter()


@router.get("/cities")
def get_cities(db: Session = Depends(get_db)):
    return db.scalars(select(City).where(City.is_active.is_(True)).order_by(City.name.asc())).all()


@router.get("/subjects")
def get_subjects(db: Session = Depends(get_db)):
    return db.scalars(select(Subject).where(Subject.is_active.is_(True)).order_by(Subject.name.asc())).all()


@router.get("/tutors")
def list_tutors(
    city: str | None = Query(default=None),
    subject: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    profiles = db.scalars(select(TutorProfile).where(TutorProfile.approved_status == ApprovalStatus.approved)).all()
    users = {user.id: user for user in db.scalars(select(User)).all()}
    items = []
    for profile in profiles:
        user = users.get(profile.user_id)
        if not user:
            continue
        if city and (profile.area or "").lower() != city.lower() and str(profile.city_id or "") != city:
            continue
        if subject and subject not in profile.subjects:
            continue
        items.append(
            {
                "id": profile.id,
                "name": user.full_name,
                "bio": profile.bio,
                "subjects": profile.subjects,
                "class_range": profile.class_range,
                "experience_years": profile.experience_years,
                "fees": profile.fees,
                "modes": profile.modes,
                "featured": profile.featured,
                "profile_photo_url": profile.profile_photo_url,
            }
        )
    return items


@router.get("/parent-leads")
def list_parent_leads(
    city: str | None = Query(default=None),
    subject: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    leads = db.scalars(select(ParentLead).order_by(desc(ParentLead.created_at))).all()
    if city:
        leads = [lead for lead in leads if lead.city.lower() == city.lower()]
    if subject:
        leads = [lead for lead in leads if subject in lead.subjects]
    return leads


@router.get("/tutor-leads")
def list_tutor_leads(
    city: str | None = Query(default=None),
    subject: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    leads = db.scalars(select(TutorLead).where(TutorLead.approved_status == ApprovalStatus.approved).order_by(desc(TutorLead.created_at))).all()
    if city:
        leads = [lead for lead in leads if lead.city.lower() == city.lower()]
    if subject:
        leads = [lead for lead in leads if subject in lead.subjects]
    return leads


@router.get("/reviews")
def list_reviews(db: Session = Depends(get_db)):
    reviews = db.scalars(select(Review).where(Review.approved.is_(True)).order_by(desc(Review.created_at)).limit(12)).all()
    users = {user.id: user.full_name for user in db.scalars(select(User)).all()}
    return [
        {
            "id": review.id,
            "rating": review.rating,
            "comment": review.comment,
            "parent_name": users.get(review.parent_id, "Parent"),
            "tutor_name": users.get(review.tutor_id, "Tutor"),
        }
        for review in reviews
    ]

