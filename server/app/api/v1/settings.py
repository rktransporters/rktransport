from io import BytesIO

import httpx
from fastapi import APIRouter, BackgroundTasks, Depends, Request, Response
from PIL import Image
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin_user
from app.core.database import get_db
from app.models.settings import SiteSettings
from app.models.user import User
from app.schemas.settings import AdminSiteSettingsResponse, SiteSettingsResponse, SiteSettingsUpdate
from app.services.revalidate_frontend import schedule_public_revalidation

router = APIRouter(tags=["Settings"])


@router.get("/favicon.png", include_in_schema=False)
async def get_favicon(request: Request, db: Session = Depends(get_db)) -> Response:
    row = _get_or_404(db)
    logo_url = row.favicon_url or row.logo_url
    if logo_url and logo_url.startswith("/"):
        logo_url = f"{str(request.base_url).rstrip('/')}{logo_url}"
    if not logo_url:
        return Response(status_code=404)

    async with httpx.AsyncClient(follow_redirects=True, timeout=15) as client:
        result = await client.get(logo_url)
    result.raise_for_status()

    with Image.open(BytesIO(result.content)) as source:
        source.thumbnail((512, 512), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (512, 512), (255, 255, 255, 255))
        canvas.paste(source.convert("RGBA"), ((512 - source.width) // 2, (512 - source.height) // 2))

    output = BytesIO()
    canvas.save(output, format="PNG", optimize=True)
    return Response(
        content=output.getvalue(),
        media_type="image/png",
        headers={"Cache-Control": "public, max-age=86400"},
    )


def _get_or_404(db: Session) -> SiteSettings:
    row = db.query(SiteSettings).filter(SiteSettings.id == 1).first()
    if not row:
        row = SiteSettings(id=1)
        db.add(row)
        db.commit()
        db.refresh(row)
    return row


@router.get("/settings", response_model=SiteSettingsResponse)
async def get_settings(db: Session = Depends(get_db)):
    return _get_or_404(db)


@router.get("/admin/settings", response_model=AdminSiteSettingsResponse)
async def get_admin_settings(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    return _get_or_404(db)


@router.put("/admin/settings", response_model=AdminSiteSettingsResponse)
async def update_settings(
    payload: SiteSettingsUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    row = _get_or_404(db)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    db.commit()
    db.refresh(row)
    schedule_public_revalidation(background_tasks)
    return row
