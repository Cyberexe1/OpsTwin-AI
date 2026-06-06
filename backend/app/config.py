from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Splunk
    splunk_host: str = "localhost"
    splunk_port: int = 8089
    splunk_hec_port: int = 8088
    splunk_username: str = "admin"
    splunk_password: str = "ChangeMeNow1!"
    splunk_hec_token: str = ""

    # OpenAI / LLM (works with Groq, OpenAI, or any compatible endpoint)
    openai_api_key: str = ""
    openai_model: str = "llama-3.3-70b-versatile"
    openai_base_url: str = "https://api.groq.com/openai/v1"

    # Database (Neon PostgreSQL)
    database_url: str = "postgresql://user:pass@localhost:5432/opstwin"

    # JWT Auth
    jwt_secret: str = "opstwin-hackathon-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440  # 24 hours

    # App
    app_name: str = "OpsTwin AI"
    debug: bool = True
    cors_origins: list[str] = ["*"]

    class Config:
        env_file = ".env"


settings = Settings()
