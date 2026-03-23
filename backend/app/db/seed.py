from __future__ import annotations

from datetime import UTC, date, datetime, timedelta
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import encrypt_phone, hash_password
from app.db.session import Base, SessionLocal, engine
from app.models import (
    ApprovalStatus,
    City,
    ModeType,
    ParentLead,
    ParentProfile,
    Payment,
    PaymentStatus,
    Review,
    State,
    Subject,
    Subscription,
    TutorLead,
    TutorProfile,
    User,
    UserRole,
)


DEFAULT_PASSWORD = "Test@12345"


def get_or_create_state(db: Session, *, name: str, code: str) -> State:
    state = db.scalar(select(State).where(State.code == code))
    if state:
        return state
    state = State(name=name, code=code)
    db.add(state)
    db.flush()
    return state


def get_or_create_city(db: Session, *, name: str, state_id: int) -> City:
    city = db.scalar(select(City).where(City.name == name))
    if city:
        return city
    city = City(name=name, state_id=state_id, is_active=True)
    db.add(city)
    db.flush()
    return city


def get_or_create_subject(db: Session, *, name: str) -> Subject:
    subject = db.scalar(select(Subject).where(Subject.name == name))
    if subject:
        return subject
    subject = Subject(name=name, is_active=True)
    db.add(subject)
    db.flush()
    return subject


def upsert_user(
    db: Session,
    *,
    full_name: str,
    email: str,
    phone: str,
    role: UserRole,
    is_verified: bool,
) -> User:
    user = db.scalar(select(User).where(User.email == email))
    if not user:
        user = User(
            full_name=full_name,
            email=email,
            phone_encrypted=encrypt_phone(phone),
            password_hash=hash_password(DEFAULT_PASSWORD),
            role=role,
            is_active=True,
            is_verified=is_verified,
            last_login_at=datetime.now(UTC),
        )
        db.add(user)
        db.flush()
    else:
        user.full_name = full_name
        user.phone_encrypted = encrypt_phone(phone)
        user.password_hash = hash_password(DEFAULT_PASSWORD)
        user.role = role
        user.is_active = True
        user.is_verified = is_verified
        db.add(user)
        db.flush()
    return user


def upsert_parent_profile(db: Session, *, user_id: int, city_id: int, state_id: int, address: str, area: str, pincode: str) -> ParentProfile:
    profile = db.scalar(select(ParentProfile).where(ParentProfile.user_id == user_id))
    if not profile:
        profile = ParentProfile(user_id=user_id)
    profile.city_id = city_id
    profile.state_id = state_id
    profile.address = address
    profile.area = area
    profile.pincode = pincode
    db.add(profile)
    db.flush()
    return profile


def upsert_tutor_profile(
    db: Session,
    *,
    user_id: int,
    city_id: int,
    area: str,
    bio: str,
    experience_years: int,
    fees: float,
    subjects: list[str],
    class_range: str,
    modes: list[str],
    demo_available: bool,
    approved_status: ApprovalStatus,
    featured: bool,
) -> TutorProfile:
    profile = db.scalar(select(TutorProfile).where(TutorProfile.user_id == user_id))
    if not profile:
        profile = TutorProfile(user_id=user_id)
    profile.city_id = city_id
    profile.area = area
    profile.bio = bio
    profile.experience_years = experience_years
    profile.fees = fees
    profile.subjects = subjects
    profile.class_range = class_range
    profile.modes = modes
    profile.demo_available = demo_available
    profile.documents = ["https://example.com/docs/id-proof.pdf"]
    profile.approved_status = approved_status
    profile.featured = featured
    db.add(profile)
    db.flush()
    return profile


def ensure_parent_lead(
    db: Session,
    *,
    parent: User,
    parent_name: str,
    mobile: str,
    email: str,
    child_name: str,
    class_name: str,
    board: str,
    subjects: list[str],
    mode: ModeType,
    address: str,
    city: str,
    area: str,
    pincode: str,
    budget: float,
    preferred_time: str,
    notes: str,
) -> ParentLead:
    lead = db.scalar(select(ParentLead).where(ParentLead.parent_id == parent.id, ParentLead.child_name == child_name))
    if not lead:
        lead = ParentLead(
            parent_id=parent.id,
            parent_name=parent_name,
            mobile_encrypted=encrypt_phone(mobile),
            email=email,
            child_name=child_name,
            class_name=class_name,
            board=board,
            subjects=subjects,
            mode=mode,
            address=address,
            city=city,
            area=area,
            pincode=pincode,
            budget=budget,
            preferred_time=preferred_time,
            start_date=date.today() + timedelta(days=7),
            notes=notes,
            status="open",
        )
        db.add(lead)
        db.flush()
    return lead


def ensure_tutor_lead(
    db: Session,
    *,
    tutor: User,
    tutor_name: str,
    subjects: list[str],
    class_range: str,
    experience: int,
    mode: list[str],
    city: str,
    area: str,
    fees: float,
    available_time: str,
    demo_available: bool,
    approved_status: ApprovalStatus,
) -> TutorLead:
    lead = db.scalar(select(TutorLead).where(TutorLead.tutor_id == tutor.id, TutorLead.city == city))
    if not lead:
        lead = TutorLead(
            tutor_id=tutor.id,
            tutor_name=tutor_name,
            subjects=subjects,
            class_range=class_range,
            experience=experience,
            mode=mode,
            city=city,
            area=area,
            fees=fees,
            available_time=available_time,
            demo_available=demo_available,
            documents=["https://example.com/docs/teaching-cert.pdf"],
            approved_status=approved_status,
        )
        db.add(lead)
        db.flush()
    return lead


def ensure_payment(db: Session, *, user_id: int, amount: str, purpose: str, status: PaymentStatus) -> Payment:
    payment = db.scalar(select(Payment).where(Payment.user_id == user_id, Payment.purpose == purpose))
    if not payment:
        payment = Payment(user_id=user_id, amount=Decimal(amount), purpose=purpose, status=status, reference=f"TEST-{user_id}-{purpose[:6].upper()}")
        db.add(payment)
        db.flush()
    return payment


def ensure_subscription(db: Session, *, tutor_id: int, plan_name: str, lead_credits: int, price: float) -> Subscription:
    subscription = db.scalar(select(Subscription).where(Subscription.tutor_id == tutor_id, Subscription.plan_name == plan_name))
    if not subscription:
        subscription = Subscription(
            tutor_id=tutor_id,
            plan_name=plan_name,
            lead_credits=lead_credits,
            price=price,
            starts_at=datetime.now(UTC),
            ends_at=datetime.now(UTC) + timedelta(days=30),
            is_active=True,
        )
        db.add(subscription)
        db.flush()
    return subscription


def ensure_review(db: Session, *, parent_id: int, tutor_id: int, rating: int, comment: str, approved: bool) -> Review:
    review = db.scalar(select(Review).where(Review.parent_id == parent_id, Review.tutor_id == tutor_id))
    if not review:
        review = Review(parent_id=parent_id, tutor_id=tutor_id, rating=rating, comment=comment, approved=approved)
        db.add(review)
        db.flush()
    return review


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        maharashtra = get_or_create_state(db, name="Maharashtra", code="MH")
        karnataka = get_or_create_state(db, name="Karnataka", code="KA")
        delhi_state = get_or_create_state(db, name="Delhi", code="DL")

        mumbai = get_or_create_city(db, name="Mumbai", state_id=maharashtra.id)
        pune = get_or_create_city(db, name="Pune", state_id=maharashtra.id)
        bengaluru = get_or_create_city(db, name="Bengaluru", state_id=karnataka.id)
        delhi = get_or_create_city(db, name="Delhi", state_id=delhi_state.id)

        for subject_name in ["Mathematics", "Science", "English", "Physics", "Chemistry", "Biology"]:
            get_or_create_subject(db, name=subject_name)

        admin_verified = upsert_user(
            db,
            full_name="Aarav Admin",
            email="admin@guruhome.test",
            phone="9000000001",
            role=UserRole.admin,
            is_verified=True,
        )
        upsert_user(
            db,
            full_name="Nisha Admin",
            email="admin.pending@guruhome.test",
            phone="9000000002",
            role=UserRole.admin,
            is_verified=False,
        )

        parent_verified = upsert_user(
            db,
            full_name="Priya Parent",
            email="parent.verified@guruhome.test",
            phone="9100000001",
            role=UserRole.parent,
            is_verified=True,
        )
        parent_unverified = upsert_user(
            db,
            full_name="Rohit Parent",
            email="parent.unverified@guruhome.test",
            phone="9100000002",
            role=UserRole.parent,
            is_verified=False,
        )

        tutor_verified = upsert_user(
            db,
            full_name="Ananya Tutor",
            email="tutor.verified@guruhome.test",
            phone="9200000001",
            role=UserRole.tutor,
            is_verified=True,
        )
        tutor_unverified = upsert_user(
            db,
            full_name="Kabir Tutor",
            email="tutor.unverified@guruhome.test",
            phone="9200000002",
            role=UserRole.tutor,
            is_verified=False,
        )

        upsert_parent_profile(
            db,
            user_id=parent_verified.id,
            city_id=mumbai.id,
            state_id=maharashtra.id,
            address="Powai, Mumbai",
            area="Powai",
            pincode="400076",
        )
        upsert_parent_profile(
            db,
            user_id=parent_unverified.id,
            city_id=pune.id,
            state_id=maharashtra.id,
            address="Baner, Pune",
            area="Baner",
            pincode="411045",
        )

        upsert_tutor_profile(
            db,
            user_id=tutor_verified.id,
            city_id=bengaluru.id,
            area="Indiranagar",
            bio="Experienced CBSE and ICSE tutor for STEM subjects.",
            experience_years=6,
            fees=800.0,
            subjects=["Mathematics", "Science", "Physics"],
            class_range="6-12",
            modes=["home", "online"],
            demo_available=True,
            approved_status=ApprovalStatus.approved,
            featured=True,
        )
        upsert_tutor_profile(
            db,
            user_id=tutor_unverified.id,
            city_id=delhi.id,
            area="Rohini",
            bio="New tutor awaiting verification.",
            experience_years=2,
            fees=500.0,
            subjects=["English", "Biology"],
            class_range="5-10",
            modes=["online"],
            demo_available=False,
            approved_status=ApprovalStatus.pending,
            featured=False,
        )

        ensure_parent_lead(
            db,
            parent=parent_verified,
            parent_name="Priya Parent",
            mobile="9100000001",
            email="parent.verified@guruhome.test",
            child_name="Ishaan",
            class_name="8",
            board="CBSE",
            subjects=["Mathematics", "Science"],
            mode=ModeType.home,
            address="Powai, Mumbai",
            city="Mumbai",
            area="Powai",
            pincode="400076",
            budget=6000.0,
            preferred_time="Evening 5 PM to 7 PM",
            notes="Looking for a patient tutor for conceptual clarity.",
        )
        ensure_parent_lead(
            db,
            parent=parent_unverified,
            parent_name="Rohit Parent",
            mobile="9100000002",
            email="parent.unverified@guruhome.test",
            child_name="Siya",
            class_name="10",
            board="ICSE",
            subjects=["English", "Biology"],
            mode=ModeType.online,
            address="Baner, Pune",
            city="Pune",
            area="Baner",
            pincode="411045",
            budget=4500.0,
            preferred_time="Morning 7 AM to 8 AM",
            notes="Needs structured board exam preparation.",
        )

        ensure_tutor_lead(
            db,
            tutor=tutor_verified,
            tutor_name="Ananya Tutor",
            subjects=["Mathematics", "Physics"],
            class_range="8-12",
            experience=6,
            mode=["home", "online"],
            city="Bengaluru",
            area="Indiranagar",
            fees=800.0,
            available_time="Weekdays after 4 PM",
            demo_available=True,
            approved_status=ApprovalStatus.approved,
        )
        ensure_tutor_lead(
            db,
            tutor=tutor_unverified,
            tutor_name="Kabir Tutor",
            subjects=["English", "Biology"],
            class_range="5-10",
            experience=2,
            mode=["online"],
            city="Delhi",
            area="Rohini",
            fees=500.0,
            available_time="Weekends",
            demo_available=False,
            approved_status=ApprovalStatus.pending,
        )

        ensure_payment(
            db,
            user_id=parent_verified.id,
            amount="299.00",
            purpose="unlock_tutor_contact",
            status=PaymentStatus.verified,
        )
        ensure_payment(
            db,
            user_id=tutor_verified.id,
            amount="499.00",
            purpose="unlock_parent_contact",
            status=PaymentStatus.pending,
        )

        ensure_subscription(
            db,
            tutor_id=tutor_verified.id,
            plan_name="Growth",
            lead_credits=25,
            price=1499.0,
        )

        ensure_review(
            db,
            parent_id=parent_verified.id,
            tutor_id=tutor_verified.id,
            rating=5,
            comment="Very clear explanations and punctual sessions.",
            approved=True,
        )

        db.commit()

        print("Seed complete.")
        print(f"Password for all sample users: {DEFAULT_PASSWORD}")
        print("Verified admin: admin@guruhome.test")
        print("Unverified admin: admin.pending@guruhome.test")
        print("Verified student-side parent: parent.verified@guruhome.test")
        print("Unverified student-side parent: parent.unverified@guruhome.test")
        print("Verified tutor: tutor.verified@guruhome.test")
        print("Unverified tutor: tutor.unverified@guruhome.test")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
