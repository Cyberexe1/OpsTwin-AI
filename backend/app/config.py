from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Splunk
    splunk_host: str = "localhost"
    splunk_port: int = 8089
    splunk_hec_port: int = 8088
    splunk_username: str = "admin"
    splunk_password: str = "ChangeMeNow1!"
    splunk_hec_token: str = ""

    # App
    app_name: str = "OpsTwin AI"
    debug: bool = True
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:5174"]

    class Config:
        env_file = ".env"


settings = Settings()
