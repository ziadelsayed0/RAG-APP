from fastapi import FastAPI, APIRouter, Depends, UploadFile,status
from fastapi.responses import JSONResponse
from helpers.config import get_settings, Settings
from controllers import DataController, ProjectController, ProcessController
from models import ResponseMessage
import os
import aiofiles
import logging
from routes import ProcessRequest

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

@data_route.post("/process/{project_id}")
async def process_endpoint(project_id: str, process_request: ProcessRequest):

    file_id = process_request.file_id
    chunk_size = process_request.chunk_size
    overlap_size = process_request.overlab_size

    process_controller = ProcessController(project_id=project_id)

    file_content = process_controller.get_file_content(file_id=file_id)

    file_chunks = process_controller.process_file_content(
        file_content=file_content,
        file_id=file_id,
        chunk_size=chunk_size,
        overlap_size=overlap_size
    )

    if file_chunks is None or len(file_chunks) == 0:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "signal": ResponseMessage.file_processing_failed.value
            }
        )

    return file_chunks
