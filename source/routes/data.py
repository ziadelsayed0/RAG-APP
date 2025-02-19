from fastapi import FastAPI, APIRouter, Depends, UploadFile,status
from fastapi.responses import JSONResponse
from helpers.config import get_settings, Settings
from controllers import DataController, ProjectController
from models import ResponseMessage
import os
import aiofiles
import logging

data_route = APIRouter(
    prefix="/api/v1/data",
    tags=["api-v1","data"],
)

logger = logging.getLogger('uvicorn.error')

@data_route.post("/upload/{project_id}")
async def upload_data(project_id: str, file: UploadFile,
                      app_settings: Settings = Depends(get_settings)):
    
    data_controller = DataController()
    is_valid,responseMessage = data_controller.validate_uploaded_file(file)

    if not is_valid:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                'response':responseMessage
            }
        )
    

    project_dir_path = ProjectController().get_project_path(project_id)
    file_path = os.path.join(
        project_dir_path,
        file.filename
    )
    try:
        async with aiofiles.open(file_path,"wb") as f:
            while chunk := await file.read(app_settings.FILE_CHUNK_SIZE):
                await f.write(chunk)
    except Exception as e:
        logger.error(f"Error while uploading the file {e}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                'response':ResponseMessage.file_failed.value
            }
        )
    
    return JSONResponse(
        content={
            'response':responseMessage
        }
    )