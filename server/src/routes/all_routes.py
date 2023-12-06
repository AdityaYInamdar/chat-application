from fastapi import APIRouter
from src.routes.login import router as login_router
from src.routes.users import router as users_router

router = APIRouter()

router.include_router(login_router)
router.include_router(users_router)

