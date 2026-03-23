from sqlalchemy.orm import Session

from app.models import AuditLog


def log_action(db: Session, actor_user_id: int | None, action: str, entity: str, entity_id: str, metadata: dict | None = None):
    entry = AuditLog(
        actor_user_id=actor_user_id,
        action=action,
        entity=entity,
        entity_id=entity_id,
        metadata_json=metadata or {},
    )
    db.add(entry)
    db.commit()

