from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    APP_NAME: str  # Annotate the field with its type
    APP_VERSION: str  # Annotate the field with its type
    FILE_ALLOWED_TYPES: list
    FILE_ALLOWED_SIZE: int
    FILE_CHUNK_SIZE: int


    

    class Config:
        env_file = ".env" # Use `model_config` and `SettingsConfigDict`



def get_settings():
    return Settings()
    