"""
Pydantic models for wake sessions
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class WakeSession(BaseModel):
    """Wake session data model"""
    userId: str
    date: str  # ISO format: YYYY-MM-DD
    pushupCount: int
    brushingSeconds: int
    wakeCompleted: bool
    motivationTrack: Optional[str] = None
    timestamp: int  # Unix timestamp

    class Config:
        json_schema_extra = {
            "example": {
                "userId": "user|123",
                "date": "2025-11-04",
                "pushupCount": 25,
                "brushingSeconds": 15,
                "wakeCompleted": True,
                "motivationTrack": "s3://rise-rite/audio/morning_1.mp3",
                "timestamp": 1699123200,
            }
        }

