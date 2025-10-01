from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # By not providing a default value, Pydantic will REQUIRE these to be set in the .env file. This is much safer.
    SECRET_KEY: str
    DATABASE_URL: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = "backend/.env"

settings = Settings()