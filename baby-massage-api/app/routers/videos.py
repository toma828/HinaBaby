from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.models.user import User, Video, Feedback, TimeStamp
from app.auth.jwt import get_current_active_user, get_current_teacher
from db.database import get_db

import os
import uuid
import shutil
from datetime import datetime

router = APIRouter(tags=["videos"])

# スキーマ定義
class VideoBase(BaseModel):
    title: str
    description: str
    baby_age: str
    practice_type: str
    question: Optional[str] = None

class VideoCreate(VideoBase):
    pass

class VideoResponse(VideoBase):
    id: int
    video_url: str
    thumbnail_url: Optional[str] = None
    user_id: int
    has_feedback: bool
    owner_name: Optional[str] = None

    class Config:
        orm_mode = True

class FeedbackCreate(BaseModel):
    content: str

class FeedbackResponse(BaseModel):
    id: int
    content: str
    video_id: int
    teacher_id: int

    class Config:
        orm_mode = True

class TimeStampCreate(BaseModel):
    time: str
    comment: str

class TimeStampResponse(BaseModel):
    id: int
    time: str
    comment: str
    video_id: int

    class Config:
        orm_mode = True

# 動画一覧取得（自分の動画のみ）
@router.get("/videos", response_model=List[VideoResponse])
async def get_videos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100
):
    if current_user.is_teacher:
        # 教師の場合は全ての動画を取得
        videos = db.query(Video).offset(skip).limit(limit).all()
    else:
        # 生徒の場合は自分の動画のみ
        videos = db.query(Video).filter(Video.user_id == current_user.id).offset(skip).limit(limit).all()
    
    # フィードバックの有無を確認
    result = []
    for video in videos:
        has_feedback = db.query(Feedback).filter(Feedback.video_id == video.id).first() is not None
        
        # ユーザー情報を取得
        user = db.query(User).filter(User.id == video.user_id).first()
        username = user.username if user else f"ユーザー {video.user_id}"

        # VideoResponseオブジェクトに変換
        video_data = VideoResponse(
            id=video.id,
            title=video.title,
            description=video.description,
            baby_age=video.baby_age,
            practice_type=video.practice_type,
            question=video.question,
            video_url=video.video_url,
            thumbnail_url=video.thumbnail_url,
            user_id=video.user_id,
            has_feedback=has_feedback,
            owner_name=username
        )
        result.append(video_data)
    
    return result

# 動画詳細取得
@router.get("/videos/{video_id}", response_model=dict)
async def get_video(
    video_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # 権限チェック（教師または自分の動画）
    if not current_user.is_teacher and video.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this video")
    
    # 動画オーナー情報
    owner = db.query(User).filter(User.id == video.user_id).first()
    
    # フィードバック取得
    feedback = db.query(Feedback).filter(Feedback.video_id == video_id).first()
    feedback_data = None
    if feedback:
        teacher = db.query(User).filter(User.id == feedback.teacher_id).first()
        feedback_data = {
            "id": feedback.id,
            "content": feedback.content,
            "teacher_name": teacher.username if teacher else "Unknown"
        }
    
    # タイムスタンプ取得
    timestamps = db.query(TimeStamp).filter(TimeStamp.video_id == video_id).all()
    timestamp_data = []
    for ts in timestamps:
        timestamp_data.append({
            "id": ts.id,
            "time": ts.time,
            "comment": ts.comment
        })
    
    return {
        "id": video.id,
        "title": video.title,
        "description": video.description,
        "baby_age": video.baby_age,
        "practice_type": video.practice_type,
        "question": video.question,
        "video_url": video.video_url,
        "thumbnail_url": video.thumbnail_url,
        "owner_name": owner.username,
        "created_at": video.created_at.isoformat() if hasattr(video, 'created_at') else None,
        "feedback": feedback_data,
        "timestamps": timestamp_data
    }

# 保存先ディレクトリの設定
UPLOAD_DIR = os.path.join(os.getcwd(), "uploads", "videos")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 動画アップロード
@router.post("/videos", response_model=dict)
async def create_video(
    title: str = Form(...),
    description: str = Form(...),
    baby_age: str = Form(...),
    practice_type: str = Form(...),
    question: Optional[str] = Form(None),
    video_file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # 教師は動画をアップロードできない
    if current_user.is_teacher:
        raise HTTPException(status_code=403, detail="Teachers cannot upload videos")
    
    # ファイルサイズのチェック
    file_size = 0
    contents = await video_file.read()
    file_size = len(contents)
    if file_size > 100 * 1024 * 1024:  # 100MB
        raise HTTPException(status_code=413, detail="File too large")
    
    # ファイル形式のチェック
    if not video_file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="File is not a video")
        
    # 一意のファイル名を生成
    file_ext = os.path.splitext(video_file.filename)[1]
    unique_filename = f"{str(uuid.uuid4())}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # ファイルを保存
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # URLの生成
    video_url = f"/uploads/videos/{unique_filename}"
    
    # データベースに保存
    db_video = Video(
        title=title,
        description=description,
        baby_age=baby_age,
        practice_type=practice_type,
        question=question,
        video_url=video_url,
        user_id=current_user.id
    )
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    
    return {"id": db_video.id, "message": "Video uploaded successfully"}

# フィードバック追加（教師のみ）
@router.post("/videos/{video_id}/feedback", response_model=dict)
async def add_feedback(
    video_id: int,
    feedback: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher)  # 教師のみ
):
    # 動画の存在確認
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # 既存のフィードバックを確認
    existing_feedback = db.query(Feedback).filter(Feedback.video_id == video_id).first()
    if existing_feedback:
        # 更新
        existing_feedback.content = feedback.content
        db.commit()
        return {"message": "Feedback updated successfully"}
    
    # 新規作成
    db_feedback = Feedback(
        content=feedback.content,
        video_id=video_id,
        teacher_id=current_user.id
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    
    return {"id": db_feedback.id, "message": "Feedback added successfully"}

# タイムスタンプ追加（教師のみ）
@router.post("/videos/{video_id}/timestamps", response_model=dict)
async def add_timestamp(
    video_id: int,
    timestamp: TimeStampCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher)  # 教師のみ
):
    # 動画の存在確認
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # タイムスタンプを追加
    db_timestamp = TimeStamp(
        time=timestamp.time,
        comment=timestamp.comment,
        video_id=video_id
    )
    db.add(db_timestamp)
    db.commit()
    db.refresh(db_timestamp)
    
    return {"id": db_timestamp.id, "message": "Timestamp added successfully"}