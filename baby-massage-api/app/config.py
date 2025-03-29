# app/config.py
import os
from pathlib import Path

# アプリケーションのベースディレクトリ
BASE_DIR = Path(__file__).resolve().parent.parent

# アップロードされたファイルを保存するディレクトリ
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
VIDEO_DIR = os.path.join(UPLOAD_DIR, "videos")
THUMBNAIL_DIR = os.path.join(UPLOAD_DIR, "thumbnails")

# ディレクトリが存在しない場合は作成
os.makedirs(VIDEO_DIR, exist_ok=True)
os.makedirs(THUMBNAIL_DIR, exist_ok=True)

# ファイルアップロードの制限
MAX_UPLOAD_SIZE = 100 * 1024 * 1024  # 100MB