from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "@G7-1Q(,IN2>;ScT5}1XYHLZ9'=R}KIt}9};`BjAD?xRscZt8UcA?WQwwF<WZ"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()