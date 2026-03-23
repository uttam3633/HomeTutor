from fastapi import HTTPException, status

from app.core.config import settings
from app.utils.files import validate_upload_name

try:
    import cloudinary
    import cloudinary.uploader

    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
        secure=True,
    )
except Exception:
    cloudinary = None


def upload_file_stub(filename: str, *, kind: str) -> dict:
    validate_upload_name(filename, kind=kind)
    if not settings.cloudinary_cloud_name:
        return {"provider": "cloudinary", "mode": "stub", "filename": filename}
    if cloudinary is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Cloudinary client unavailable")
    return {"provider": "cloudinary", "mode": "configured", "filename": filename}
