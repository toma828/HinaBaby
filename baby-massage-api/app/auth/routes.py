from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.auth.jwt import (
    ACCESS_TOKEN_EXPIRE_MINUTES, authenticate_user, create_access_token,
    get_current_active_user, get_password_hash
)
from app.models.user import User
from db.database import get_db

router = APIRouter(tags=["authentication"])

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    is_teacher: bool = False

@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "is_teacher": user.is_teacher}

@router.post("/register", response_model=dict)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    # デバッグ情報を出力
    print("="*50)
    print("Registration request received")
    print(f"Username: {user_data.username}")
    print(f"Email: {user_data.email}")
    print(f"Is Teacher: {user_data.is_teacher}")
    print("="*50)
    
    # 既存のユーザーチェック
    db_user = db.query(User).filter(User.username == user_data.username).first()
    if db_user:
        print(f"Username {user_data.username} already exists")
        raise HTTPException(status_code=400, detail="Username already registered")
    
    db_email = db.query(User).filter(User.email == user_data.email).first()
    if db_email:
        print(f"Email {user_data.email} already exists")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    try:
        # 新しいユーザーを作成
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password,
            is_teacher=user_data.is_teacher
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        print(f"User {user_data.username} created successfully")
        
        return {"message": "User created successfully"}
    except Exception as e:
        print(f"Error creating user: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "is_teacher": current_user.is_teacher
    }