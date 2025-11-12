# MediaPipe Loading & Integration Guide

## Current Implementation

MediaPipe is now integrated and will automatically load when available. The system supports multiple MediaPipe packages:

1. **`react-native-mediapipe`** (cdiddy77) - Recommended, better vision-camera support
2. **`@thinksys/react-native-mediapipe`** - Alternative package

## Installation

### Option 1: react-native-mediapipe (Recommended)

```bash
cd mobile
npm install react-native-mediapipe
npx expo prebuild
npx expo run:android  # or npx expo run:ios
```

### Option 2: @thinksys/react-native-mediapipe

```bash
cd mobile
npm install @thinksys/react-native-mediapipe
npx expo prebuild
npx expo run:android
```

## How It Works

1. **Auto-Detection**: App tries to load MediaPipe on startup
2. **Initialization**: MediaPipe Pose Landmarker is initialized
3. **Frame Processing**: Each camera frame is processed with MediaPipe
4. **Results**: Pose landmarks are extracted and passed to detection logic

## Integration Points

### 1. Initialization
- `mediapipeNative.ts` - Initializes MediaPipe pose detector
- Called automatically by `PoseDetectionManager`

### 2. Frame Processing
- `usePoseDetector.ts` - Frame processor processes each frame
- Calls `processFrameWithMediaPipe` for each frame
- Results passed to `processPoseResults`

### 3. Landmark Extraction
- `poseDetection.ts` - Extracts landmarks from MediaPipe results
- Converts to our `PoseLandmarks` format
- Calculates elbow angles for push-up detection

## Model Files

MediaPipe requires model files. For `react-native-mediapipe`:

1. Download `pose_landmarker.task` from MediaPipe
2. Place in `mobile/assets/models/`
3. Update path in `mediapipeNative.ts` if needed

Or the package may bundle the model automatically.

## Testing

After installation:

1. Build development client: `npx expo prebuild && npx expo run:android`
2. Check console for: `✅ Pose detection initialized with backend: mediapipe`
3. Test push-up detection
4. Verify landmarks are detected accurately

## Troubleshooting

### "MediaPipe native module not available"
- Ensure package is installed: `npm install react-native-mediapipe`
- Run `npx expo prebuild` to generate native code
- Rebuild development client

### "MediaPipe not initialized"
- Check model file is available
- Verify native module is linked correctly
- Check console for initialization errors

### No pose detection
- Verify camera permissions
- Check frame processor is active
- Review MediaPipe initialization logs

## Current Status

✅ **MediaPipe integration code** - Complete
✅ **Auto-detection** - Tries MediaPipe first
✅ **Frame processing** - Integrated with vision-camera
✅ **Landmark extraction** - Ready
⚠️ **Requires package install** - `npm install react-native-mediapipe`
⚠️ **Requires native build** - `npx expo prebuild`

The code is ready - just install the package and rebuild!


