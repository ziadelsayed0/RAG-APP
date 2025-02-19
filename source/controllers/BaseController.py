from helpers.config import get_settings
import os

class BaseController:
    def __init__(self):
        self.app_settings = get_settings() # ✅ Store instance of Settings
        self.baseDir = os.path.dirname(os.path.dirname(__file__))
        self.file_dir = os.path.join(
            self.baseDir,
            'assets/files'
        )