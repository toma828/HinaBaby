from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import engine

from app.auth.routes import router as auth_router
from app.routers.videos import router as videos_router
from db.database import Base, engine

from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

from app.config import UPLOAD_DIR

# データベースを初期化
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Baby Massage API")

# CORS設定 - フロントエンドのオリジンを許可
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # フロントエンドのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 追加のCORSヘッダーを確実に設定するミドルウェア
@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

# OPTIONSリクエスト用のグローバルハンドラー
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    return JSONResponse(
        content={"message": "OK"},
        headers={
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
    )

# ルーターの登録
app.include_router(auth_router, prefix="/api")
app.include_router(videos_router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
VIDEOS_DIR = os.path.join(UPLOAD_DIR, "videos")
os.makedirs(VIDEOS_DIR, exist_ok=True)

# StaticFilesをマウント
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")