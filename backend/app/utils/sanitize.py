import bleach


def sanitize_text(value: str | None) -> str | None:
    if value is None:
        return None
    return bleach.clean(value.strip(), tags=[], attributes={}, strip=True)

