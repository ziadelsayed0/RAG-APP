from fastapi import FastAPI, APIRouter
import os
base_route = APIRouter(
    prefix="/api/v1",
    tags=["api-v1"],
)

@base_route.get("/")
async def begin_servce():
    app_name = os.getenv('APP_NAME')
    app_version = os.getenv('APP_VERSION')
    return {"App_Name":app_name,
            "App_Version":app_version
            }