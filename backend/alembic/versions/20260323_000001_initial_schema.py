"""initial schema"""

from alembic import op
import sqlalchemy as sa


revision = "20260323_000001"
down_revision = None
branch_labels = None
depends_on = None


user_role = sa.Enum("parent", "tutor", "admin", name="userrole")
approval_status = sa.Enum("pending", "approved", "rejected", name="approvalstatus")
payment_status = sa.Enum("pending", "verified", "rejected", name="paymentstatus")
unlock_target = sa.Enum("parent_lead", "tutor_lead", name="unlocktarget")
mode_type = sa.Enum("home", "online", "group", "institute", name="modetype")


def upgrade() -> None:
    bind = op.get_bind()
    user_role.create(bind, checkfirst=True)
    approval_status.create(bind, checkfirst=True)
    payment_status.create(bind, checkfirst=True)
    unlock_target.create(bind, checkfirst=True)
    mode_type.create(bind, checkfirst=True)

    op.create_table(
        "states",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=120), nullable=False, unique=True),
        sa.Column("code", sa.String(length=10), nullable=False, unique=True),
    )
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=True, unique=True),
        sa.Column("phone_encrypted", sa.Text(), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=True),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("role", user_role, nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("is_verified", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("last_login_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_users_id", "users", ["id"])
    op.create_index("ix_users_email", "users", ["email"])
    op.create_table(
        "cities",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=120), nullable=False, unique=True),
        sa.Column("state_id", sa.Integer(), sa.ForeignKey("states.id"), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
    )
    op.create_table(
        "subjects",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=120), nullable=False, unique=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
    )
    op.create_table(
        "parent_profiles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False, unique=True),
        sa.Column("city_id", sa.Integer(), sa.ForeignKey("cities.id"), nullable=True),
        sa.Column("state_id", sa.Integer(), sa.ForeignKey("states.id"), nullable=True),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("area", sa.String(length=120), nullable=True),
        sa.Column("pincode", sa.String(length=12), nullable=True),
    )
    op.create_table(
        "tutor_profiles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False, unique=True),
        sa.Column("bio", sa.Text(), nullable=True),
        sa.Column("city_id", sa.Integer(), sa.ForeignKey("cities.id"), nullable=True),
        sa.Column("area", sa.String(length=120), nullable=True),
        sa.Column("experience_years", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("fees", sa.Float(), nullable=True),
        sa.Column("subjects", sa.JSON(), nullable=False),
        sa.Column("class_range", sa.String(length=120), nullable=True),
        sa.Column("modes", sa.JSON(), nullable=False),
        sa.Column("demo_available", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("profile_photo_url", sa.String(length=500), nullable=True),
        sa.Column("documents", sa.JSON(), nullable=False),
        sa.Column("approved_status", approval_status, nullable=False, server_default="pending"),
        sa.Column("featured", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.create_table(
        "parent_leads",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("parent_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("parent_name", sa.String(length=255), nullable=False),
        sa.Column("mobile_encrypted", sa.Text(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("child_name", sa.String(length=255), nullable=False),
        sa.Column("class_name", sa.String(length=50), nullable=False),
        sa.Column("board", sa.String(length=100), nullable=False),
        sa.Column("subjects", sa.JSON(), nullable=False),
        sa.Column("mode", mode_type, nullable=False),
        sa.Column("address", sa.Text(), nullable=False),
        sa.Column("city", sa.String(length=120), nullable=False),
        sa.Column("area", sa.String(length=120), nullable=False),
        sa.Column("pincode", sa.String(length=12), nullable=False),
        sa.Column("budget", sa.Float(), nullable=False),
        sa.Column("preferred_time", sa.String(length=255), nullable=False),
        sa.Column("start_date", sa.Date(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="open"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_table(
        "tutor_leads",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("tutor_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("tutor_name", sa.String(length=255), nullable=False),
        sa.Column("subjects", sa.JSON(), nullable=False),
        sa.Column("class_range", sa.String(length=120), nullable=False),
        sa.Column("experience", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("mode", sa.JSON(), nullable=False),
        sa.Column("city", sa.String(length=120), nullable=False),
        sa.Column("area", sa.String(length=120), nullable=False),
        sa.Column("fees", sa.Float(), nullable=False),
        sa.Column("available_time", sa.String(length=255), nullable=False),
        sa.Column("demo_available", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("profile_photo", sa.String(length=500), nullable=True),
        sa.Column("documents", sa.JSON(), nullable=False),
        sa.Column("approved_status", approval_status, nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_table(
        "payments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("purpose", sa.String(length=120), nullable=False),
        sa.Column("status", payment_status, nullable=False, server_default="pending"),
        sa.Column("reference", sa.String(length=120), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_table(
        "payment_proofs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("payment_id", sa.Integer(), sa.ForeignKey("payments.id"), nullable=False),
        sa.Column("screenshot_url", sa.String(length=500), nullable=False),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("approved_by", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("reviewed_at", sa.DateTime(), nullable=True),
    )
    op.create_table(
        "subscriptions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("tutor_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("plan_name", sa.String(length=120), nullable=False),
        sa.Column("lead_credits", sa.Integer(), nullable=False),
        sa.Column("price", sa.Float(), nullable=False),
        sa.Column("starts_at", sa.DateTime(), nullable=False),
        sa.Column("ends_at", sa.DateTime(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
    )
    op.create_table(
        "reviews",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("parent_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("tutor_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column("comment", sa.Text(), nullable=True),
        sa.Column("approved", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_table(
        "otp",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("identifier", sa.String(length=255), nullable=False),
        sa.Column("code", sa.String(length=10), nullable=False),
        sa.Column("purpose", sa.String(length=50), nullable=False),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column("verified", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_otp_identifier", "otp", ["identifier"])
    op.create_table(
        "audit_logs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("actor_user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("action", sa.String(length=120), nullable=False),
        sa.Column("entity", sa.String(length=120), nullable=False),
        sa.Column("entity_id", sa.String(length=120), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_table(
        "lead_unlocks",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("target_type", unlock_target, nullable=False),
        sa.Column("target_id", sa.Integer(), nullable=False),
        sa.Column("payment_id", sa.Integer(), sa.ForeignKey("payments.id"), nullable=True),
        sa.Column("unlocked_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("lead_unlocks")
    op.drop_table("audit_logs")
    op.drop_index("ix_otp_identifier", table_name="otp")
    op.drop_table("otp")
    op.drop_table("reviews")
    op.drop_table("subscriptions")
    op.drop_table("payment_proofs")
    op.drop_table("payments")
    op.drop_table("tutor_leads")
    op.drop_table("parent_leads")
    op.drop_table("tutor_profiles")
    op.drop_table("parent_profiles")
    op.drop_table("subjects")
    op.drop_table("cities")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_index("ix_users_id", table_name="users")
    op.drop_table("users")
    op.drop_table("states")

    bind = op.get_bind()
    mode_type.drop(bind, checkfirst=True)
    unlock_target.drop(bind, checkfirst=True)
    payment_status.drop(bind, checkfirst=True)
    approval_status.drop(bind, checkfirst=True)
    user_role.drop(bind, checkfirst=True)
