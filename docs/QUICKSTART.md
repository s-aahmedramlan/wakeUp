# Quick Start Guide

## Setup Instructions

### 1. Install Dependencies

**Root:**
```bash
npm install
```

**Mobile:**
```bash
cd mobile
npm install
```

**Backend:**
```bash
cd api/fastapi
pip install -r requirements.txt
```

### 2. Configure AWS (Backend)

Follow instructions in `infra/aws-setup.md` to:
1. Create AWS account
2. Configure AWS CLI credentials
3. Create DynamoDB table

### 3. Set Environment Variables (Backend)

Create `api/fastapi/.env`:
```
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=WakeSessions
```

### 4. Run Backend

```bash
cd api/fastapi
python main.py
```

Backend will run on `http://localhost:8000`

### 5. Run Mobile App

```bash
cd mobile
npx expo start
```

For development build (required for camera):
```bash
npx expo prebuild
npx expo run:android  # or run:ios
```

### 6. Add Audio Files (Optional for MVP)

Place audio files in `mobile/assets/sounds/`:
- `alarm.mp3` - Alarm sound
- `motivation.mp3` - Motivational track

If files don't exist, the app will continue to work (system sounds will be used).

## Testing the MVP

1. **Set Alarm**: Open app → Set alarm time → Enable alarm
2. **Wait for Alarm**: Alarm will trigger at scheduled time
3. **Complete Push-ups**: Do push-ups in front of camera
4. **Check Session**: Session logged to local DB and synced to DynamoDB

## Troubleshooting

### Camera not working
- Ensure expo-dev-client is installed
- Rebuild: `npx expo prebuild`
- Check permissions in app.json

### Backend not connecting
- Verify AWS credentials are set
- Check DynamoDB table exists
- Review API URL in `mobile/src/services/api.ts`

### CV not detecting
- Current implementation is a placeholder
- Replace with TensorFlow Lite model in `usePoseDetector.ts`
- See `docs/DEVELOPMENT.md` for implementation details

## Next Steps

1. Integrate actual TensorFlow Lite pose detection model
2. Add brushing verification (Phase 2)
3. Improve CV accuracy and form validation
4. Add web dashboard for analytics


