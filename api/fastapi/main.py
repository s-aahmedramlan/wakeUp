"""
RiseRite FastAPI Backend
Handles wake session logging and user analytics
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import boto3
from datetime import datetime
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
# Get the directory where this script is located
script_dir = Path(__file__).parent
env_path = script_dir / '.env'
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="RiseRite API", version="1.0.0")

# CORS middleware for mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AWS DynamoDB client
dynamodb = boto3.resource(
    "dynamodb",
    region_name=os.getenv("AWS_REGION", "us-east-2"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
)

# Get table name from environment or use default
WAKE_SESSIONS_TABLE = os.getenv("DYNAMODB_TABLE_NAME", "WakeSessions")


class WakeSessionRequest(BaseModel):
    userId: str
    date: str
    pushupCount: int
    brushingSeconds: int
    wakeCompleted: bool
    motivationTrack: Optional[str] = None
    timestamp: int


class WakeSessionResponse(BaseModel):
    success: bool
    message: str


class StreakResponse(BaseModel):
    userId: str
    streak: int
    lastSessionDate: Optional[str] = None


@app.get("/")
async def root():
    return {"message": "RiseRite API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/session/wake", response_model=WakeSessionResponse)
async def log_wake_session(session: WakeSessionRequest):
    """
    Log a wake session to DynamoDB
    """
    try:
        table = dynamodb.Table(WAKE_SESSIONS_TABLE)

        item = {
            "userId": session.userId,
            "date": session.date,
            "pushupCount": session.pushupCount,
            "brushingSeconds": session.brushingSeconds,
            "wakeCompleted": int(session.wakeCompleted),
            "timestamp": session.timestamp,
        }

        if session.motivationTrack:
            item["motivationTrack"] = session.motivationTrack

        table.put_item(Item=item)

        return WakeSessionResponse(
            success=True, message="Session logged successfully"
        )
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error logging session: {e}")
        print(f"Traceback: {error_details}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to log session: {str(e)}"
        )


@app.get("/user/{user_id}/streak", response_model=StreakResponse)
async def get_streak(user_id: str):
    """
    Calculate and return the user's current streak
    """
    try:
        table = dynamodb.Table(WAKE_SESSIONS_TABLE)

        # Query sessions for this user, ordered by date descending
        response = table.query(
            KeyConditionExpression="userId = :uid",
            ExpressionAttributeValues={":uid": user_id},
            ScanIndexForward=False,  # Descending order
            Limit=30,  # Check last 30 days
        )

        sessions = response.get("Items", [])
        if not sessions:
            return StreakResponse(userId=user_id, streak=0)

        # Calculate streak
        streak = 0
        last_session_date = None
        current_date = datetime.now().date()

        for session in sessions:
            session_date_str = session.get("date")
            if not session_date_str:
                continue

            try:
                session_date = datetime.strptime(session_date_str, "%Y-%m-%d").date()
            except ValueError:
                continue

            # Check if session was completed
            if not session.get("wakeCompleted", 0):
                continue

            # Calculate days difference
            if last_session_date is None:
                last_session_date = session_date
                days_diff = (current_date - session_date).days
            else:
                days_diff = (last_session_date - session_date).days

            # If gap is more than 1 day, streak is broken
            if days_diff > 1:
                break

            streak += 1
            last_session_date = session_date

            # If we've checked yesterday and today, we're done
            if days_diff >= 1:
                break

        return StreakResponse(
            userId=user_id,
            streak=streak,
            lastSessionDate=last_session_date.isoformat() if last_session_date else None,
        )
    except Exception as e:
        print(f"Error calculating streak: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to calculate streak: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

