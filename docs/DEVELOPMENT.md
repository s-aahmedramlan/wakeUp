# Development Guide

## Architecture Overview

### Mobile App (Expo)

- **Framework**: Expo with Development Build (expo-dev-client)
- **State Management**: Zustand
- **Navigation**: React Navigation
- **CV**: TensorFlow Lite via react-native-vision-camera frame processors
- **Storage**: SQLite (local) + DynamoDB (sync)

### Backend (FastAPI)

- **Framework**: FastAPI
- **Database**: AWS DynamoDB
- **Storage**: AWS S3 (for audio assets)
- **Authentication**: JWT tokens (MVP), Cognito (Phase 2+)

## Key Files

### Mobile

- `mobile/App.tsx` - Main app entry point with navigation
- `mobile/src/screens/AlarmSetup.tsx` - Alarm configuration screen
- `mobile/src/screens/AlarmRing.tsx` - Full-screen alarm with CV
- `mobile/src/hooks/usePoseDetector.ts` - Pose detection hook
- `mobile/src/services/audio.ts` - Audio playback service
- `mobile/src/services/notifications.ts` - Alarm scheduling
- `mobile/src/services/database.ts` - Local SQLite storage
- `mobile/src/services/api.ts` - Backend API client

### Backend

- `api/fastapi/main.py` - FastAPI application
- `api/fastapi/models/wake_session.py` - Data models

## Computer Vision Implementation

The MVP uses a simplified approach for push-up detection. The actual CV integration should:

1. Use TensorFlow Lite model loaded via `@tensorflow/tfjs-react-native`
2. Process frames from `react-native-vision-camera` frame processor
3. Extract keypoints (shoulders, elbows, wrists)
4. Calculate elbow angles
5. Detect down/up positions
6. Count reps when transitioning from down to up

See `mobile/src/hooks/usePoseDetector.ts` for the current placeholder implementation.

## Testing

### Manual Testing Checklist

- [ ] Alarm triggers at scheduled time
- [ ] Camera activates on alarm
- [ ] Push-ups are detected accurately (≥90% in normal lighting)
- [ ] Audio transitions from alarm to motivation
- [ ] Session is logged to local database
- [ ] Session syncs to DynamoDB when online
- [ ] Settings persist correctly

### Device Testing

Test on physical devices with:
- Different lighting conditions
- Different camera angles
- Various push-up speeds
- Edge cases (partial visibility, poor form)

## Troubleshooting

### Camera not working

- Check permissions in app.json
- Ensure expo-dev-client is installed
- Rebuild native code: `npx expo prebuild`

### CV detection not working

- Verify TensorFlow Lite model is loaded
- Check frame processor is receiving frames
- Review console logs for errors

### Backend connection issues

- Verify AWS credentials are set
- Check DynamoDB table exists
- Review API endpoint URL in `mobile/src/services/api.ts`


