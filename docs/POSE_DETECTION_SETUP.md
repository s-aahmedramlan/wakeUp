# Pose Detection Setup Guide

## Overview

The app supports two pose detection backends:
1. **MediaPipe** (via native module) - Recommended for best performance
2. **TensorFlow Lite** - Alternative that works well with React Native

## Option 1: MediaPipe Native Module (Recommended)

### Installation

```bash
cd mobile
npm install @thinksys/react-native-mediapipe
npx expo prebuild
npx expo run:android  # or npx expo run:ios
```

### Configuration

The app will automatically detect and use MediaPipe if available. No additional configuration needed.

### Pros
- Native GPU acceleration
- High accuracy
- Real MediaPipe performance

### Cons
- Requires native code compilation
- More complex setup

## Option 2: TensorFlow Lite

### Setup

1. **Download MoveNet Model**:
   - Go to: https://tfhub.dev/google/tfjs-model/movenet/singlepose/thunder/4
   - Download the model files
   - Place in `mobile/assets/models/movenet_thunder/`

2. **Or use URL loading** (requires internet):
   - The app will try to load from URL automatically
   - Model URL is configured in `tensorflowPose.ts`

### Configuration

Edit `mobile/src/services/poseDetectionConfig.ts`:
```typescript
export const DEFAULT_CONFIG: PoseDetectionConfig = {
  backend: 'tensorflow', // Force TensorFlow
  // ... other settings
};
```

### Pros
- Better React Native support
- Works with expo-dev-client
- Good performance

### Cons
- Requires model download
- Slightly less accurate than MediaPipe

## Auto-Detection (Default)

The app uses `backend: 'auto'` by default, which:
1. Tries MediaPipe first
2. Falls back to TensorFlow if MediaPipe unavailable
3. Uses placeholder if neither available

## Testing

After setup, test pose detection:

1. Open the app
2. Set an alarm
3. When alarm rings, position yourself for push-ups
4. Verify landmarks are detected
5. Test rep counting accuracy

## Troubleshooting

### MediaPipe not working
- Ensure `npx expo prebuild` was run
- Rebuild development client
- Check native module is linked correctly

### TensorFlow not working
- Check model is downloaded/bundled
- Verify internet connection (if loading from URL)
- Check TensorFlow initialization logs

### No pose detection
- Check camera permissions
- Verify frame processor is active
- Review console logs for errors

## Current Implementation Status

✅ **Pose detection logic** - Complete
✅ **Landmark extraction** - Complete
✅ **Push-up counting** - Complete
✅ **Form validation** - Complete
⚠️ **MediaPipe integration** - Requires native module setup
⚠️ **TensorFlow integration** - Requires model download

The detection algorithms are ready - you just need to connect the pose detection backend!


