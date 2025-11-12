# MediaPipe Pose Detection Implementation Guide

## Current Status

✅ **Pose detection logic implemented** - All the push-up detection algorithms are ready
✅ **Landmark extraction** - Code to extract and process pose landmarks
✅ **Angle calculation** - Elbow angle calculation for push-up detection
✅ **State machine** - Rep counting logic with debouncing

⚠️ **MediaPipe integration pending** - Requires native module setup

## The Challenge

MediaPipe JavaScript packages (`@mediapipe/pose`) are designed for **web browsers only** and don't work directly with React Native. To use MediaPipe in React Native, you need:

1. **Native MediaPipe module** - A React Native package that bridges MediaPipe C++ to JavaScript
2. **Frame format conversion** - Convert vision-camera frames to MediaPipe format
3. **Native code compilation** - Build with `expo prebuild` and native development tools

## Implementation Options

### Option 1: Native MediaPipe Package (Recommended for MediaPipe)

**Package**: `@thinksys/react-native-mediapipe` or `@gymbrosinc/react-native-mediapipe-pose`

**Steps**:
```bash
cd mobile
npm install @thinksys/react-native-mediapipe
npx expo prebuild
npx expo run:android  # or run:ios
```

**Integration**:
Update `mobile/src/hooks/usePoseDetector.ts` to use the native module:
```typescript
import { RNMediapipe } from '@thinksys/react-native-mediapipe';

// In component:
<RNMediapipe
  onLandmark={(landmarks) => {
    // Convert to MediaPipe format
    const results = { poseLandmarks: convertLandmarks(landmarks) };
    processPoseResults(results);
  }}
/>
```

### Option 2: TensorFlow Lite (Practical Alternative)

**Already in dependencies**: `@tensorflow/tfjs-react-native`

**Steps**:
1. Download MoveNet or PoseNet model
2. Bundle with app or load from URL
3. Process frames in frame processor
4. Extract landmarks (already implemented in `tensorflowPose.ts`)

**Pros**:
- Better React Native support
- Works with expo-dev-client
- Good performance
- Already in package.json

### Option 3: Custom Native Bridge

Create a custom native module to bridge MediaPipe C++ to React Native.

**Complexity**: High (requires native development)

## What's Already Implemented

### ✅ Complete Implementation

1. **`usePoseDetector.ts`** - Main hook with:
   - Pose results processing
   - Push-up state machine
   - Rep counting with debouncing
   - Form validation

2. **`poseDetection.ts`** - Landmark processing:
   - Extract landmarks from MediaPipe results
   - Calculate elbow angles
   - Detect push-up position
   - Validate form

3. **`pushupDetection.ts`** - Utilities:
   - Angle calculation
   - Position detection
   - Form validation

### ⚠️ Needs Integration

1. **Frame processing** - Connect vision-camera frames to pose detection
2. **Model loading** - Load MediaPipe or TensorFlow model
3. **Native module setup** - If using native MediaPipe package

## Next Steps

1. **Choose approach**:
   - For MediaPipe: Install `@thinksys/react-native-mediapipe`
   - For TensorFlow: Use existing `tensorflowPose.ts` implementation

2. **Update frame processor**:
   - Connect vision-camera frames to chosen solution
   - Process frames and extract landmarks
   - Call `processPoseResults` with results

3. **Test on device**:
   - Build development client
   - Test pose detection accuracy
   - Verify push-up counting (target: ≥90% accuracy)

## Testing Checklist

- [ ] Pose detection initializes correctly
- [ ] Landmarks are extracted accurately
- [ ] Elbow angles calculated correctly
- [ ] Push-up position detected
- [ ] Reps counted accurately (≥90% accuracy)
- [ ] Form validation works
- [ ] Performance is acceptable (no lag)

## Current Code Structure

```
mobile/src/
├── hooks/
│   └── usePoseDetector.ts       ← Main hook (ready for integration)
├── services/
│   ├── poseDetection.ts         ← Landmark processing (complete)
│   ├── tensorflowPose.ts        ← TensorFlow alternative (ready)
│   └── mediapipeBridge.ts       ← Bridge placeholder
└── utils/
    └── pushupDetection.ts       ← Utilities (complete)
```

All the logic is ready - you just need to connect the pose detection model!


