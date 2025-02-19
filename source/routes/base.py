from fastapi import FastAPI, APIRouter, Depends
from helpers.config import get_settings, Settings

base_route = APIRouter(
    prefix="/api/v1",
    tags=["api-v1"],
)

@base_route.get("/")
async def begin_servce(app_settings: Settings = Depends(get_settings)):

    # app_settings = get_settings()
    app_name = app_settings.APP_NAME
    app_version = app_settings.APP_VERSION

    return {"App_Name":app_name,
            "App_Version":app_version
            }