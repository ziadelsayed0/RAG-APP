from .BaseController import BaseController
from fastapi import UploadFile
from models import ResponseMessage

class DataController(BaseController):
    def __init__(self):
        super().__init__()
        self.size_scale = 1048576 # Convert size from MB to Bytes

    def validate_uploaded_file(self, file: UploadFile):
        if file.content_type not in self.app_settings.FILE_ALLOWED_TYPES:
            return False, ResponseMessage.file_type_not_supported.value
        
        if file.size > self.app_settings.FILE_ALLOWED_SIZE * self.size_scale:
            return False, ResponseMessage.file_Size_not_supported.value

        return True, ResponseMessage.file_succeeded.value
