from sqlalchemy import Boolean, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_teacher = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

    # リレーションシップ - ユーザーと動画の関連付け
    videos = relationship("Video", back_populates="owner")

class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    baby_age = Column(String)
    practice_type = Column(String)
    question = Column(String, nullable=True)
    video_url = Column(String)
    thumbnail_url = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # リレーションシップ
    owner = relationship("User", back_populates="videos")
    feedback = relationship("Feedback", back_populates="video", uselist=False)
    timestamps = relationship("TimeStamp", back_populates="video")

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    video_id = Column(Integer, ForeignKey("videos.id"))
    teacher_id = Column(Integer, ForeignKey("users.id"))
    
    # リレーションシップ
    video = relationship("Video", back_populates="feedback")
    teacher = relationship("User")

class TimeStamp(Base):
    __tablename__ = "timestamps"

    id = Column(Integer, primary_key=True, index=True)
    time = Column(String)  # "2:30" のような形式
    comment = Column(String)
    video_id = Column(Integer, ForeignKey("videos.id"))
    
    # リレーションシップ
    video = relationship("Video", back_populates="timestamps")