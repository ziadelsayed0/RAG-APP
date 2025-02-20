from enum import Enum


class ResponseMessage(Enum):

    file_succeeded = 'File Upload Succeeded'
    file_failed= 'File Upload Failed'
    file_type_not_supported = 'File Type Not Supported'
    file_Size_not_supported = 'File Size Not Supported'
    file_processing_failed= 'File Processing Failed'
