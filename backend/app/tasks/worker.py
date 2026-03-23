from celery import Celery

from app.core.config import settings

celery_app = Celery("guruhome", broker=settings.redis_url, backend=settings.redis_url)


@celery_app.task
def send_notification(message: str):
    return {"sent": True, "message": message}

