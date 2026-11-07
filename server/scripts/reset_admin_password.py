import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.core.config import settings
from app.models.user import User


def main() -> None:
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == settings.ADMIN_USERNAME).first()
        if not user:
            db.add(
                User(
                    username=settings.ADMIN_USERNAME,
                    email=settings.ADMIN_EMAIL,
                    hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                    is_admin=True,
                    is_active=True,
                )
            )
        else:
            user.email = settings.ADMIN_EMAIL
            user.hashed_password = get_password_hash(settings.ADMIN_PASSWORD)
            user.is_admin = True
            user.is_active = True
        db.commit()
        print(f"Admin credentials reset for {settings.ADMIN_USERNAME}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
