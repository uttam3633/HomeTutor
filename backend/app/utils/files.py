from pathlib import Path

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_DOCUMENT_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}


def validate_upload_name(filename: str, *, kind: str) -> str:
    extension = Path(filename).suffix.lower()
    allowed = ALLOWED_IMAGE_EXTENSIONS if kind == "image" else ALLOWED_DOCUMENT_EXTENSIONS
    if extension not in allowed:
        raise ValueError(f"Unsupported {kind} file type")
    return filename

