# Architecture Documentation

## System Overview

RiseRite is a mobile-first application that uses on-device computer vision to verify morning routines (push-ups, brushing) and enforces healthy habits through gamification.

### Core Components

1. **Mobile App** (React Native/Expo)
   - Alarm scheduling and notifications
   - Camera-based CV verification
   - Local storage (SQLite)
   - Backend sync (DynamoDB)

2. **Backend API** (FastAPI)
   - Session logging
   - Streak calculation
   - User analytics

3. **AWS Infrastructure**
   - DynamoDB (session storage)
   - S3 (audio assets)
   - Lambda (optional, for serverless)

## Data Flow

### Alarm Flow
1. User sets alarm in AlarmSetup screen
2. Alarm scheduled via expo-notifications
3. Alarm triggers at scheduled time
4. AlarmRing screen opens with camera
5. CV detects push-ups
6. Audio transitions from alarm to motivation
7. Session logged to SQLite + DynamoDB

### Session Logging
1. Mobile app saves to local SQLite
2. Mobile app attempts to sync to FastAPI
3. FastAPI validates and saves to DynamoDB
4. Offline sessions sync when online

## Computer Vision Pipeline

### Current (MVP Placeholder)
- Frame processor receives camera frames
- Placeholder logic simulates detection
- Rep counting based on timer

### Production (To Implement)
1. Load TensorFlow Lite pose model
2. Process each frame through model
3. Extract keypoints (shoulders, elbows, wrists)
4. Calculate elbow angles
5. Detect down/up positions
6. Count reps on transitions
7. Validate form (keypoint positions)

### Key Files
- `mobile/src/hooks/usePoseDetector.ts` - Main CV hook
- `mobile/src/utils/pushupDetection.ts` - Detection utilities

## Database Schema

### DynamoDB (WakeSessions)
```
Partition Key: userId (String)
Sort Key: date (String, YYYY-MM-DD)
Attributes:
  - pushupCount (Number)
  - brushingSeconds (Number)
  - wakeCompleted (Number, 0/1)
  - motivationTrack (String, optional)
  - timestamp (Number)
```

### SQLite (Local)
Same schema as DynamoDB for offline support.

## API Endpoints

### POST /session/wake
Log a wake session.

**Request:**
```json
{
  "userId": "user|123",
  "date": "2025-11-04",
  "pushupCount": 25,
  "brushingSeconds": 15,
  "wakeCompleted": true,
  "timestamp": 1699123200
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session logged successfully"
}
```

### GET /user/{user_id}/streak
Get user's current streak.

**Response:**
```json
{
  "userId": "user|123",
  "streak": 7,
  "lastSessionDate": "2025-11-04"
}
```

## Security Considerations

### MVP
- Basic JWT or API keys (simplified)
- No user authentication (demo userId)

### Production
- AWS Cognito for authentication
- IAM roles for Lambda/DynamoDB access
- Encrypted data in transit and at rest
- API rate limiting

## Performance Considerations

### Mobile
- CV inference runs on-device (privacy + latency)
- Frame processing optimized for 30fps
- Local SQLite for fast read/write
- Background sync to DynamoDB

### Backend
- DynamoDB on-demand billing (scales automatically)
- FastAPI async handlers
- Connection pooling for AWS services

## Future Enhancements

1. **ML Improvements**
   - Custom TensorFlow Lite model training
   - Brushing detection model
   - Form validation improvements

2. **Infrastructure**
   - CDK for IaC
   - CloudWatch monitoring
   - Automated testing pipeline

3. **Features**
   - Move module (workouts)
   - Focus module (deep work)
   - Web dashboard
   - Social features


