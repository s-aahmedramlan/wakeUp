# MediaPipe Setup with EAS Build

This guide explains how to set up MediaPipe pose detection with EAS Build for iOS development.

## Overview

MediaPipe requires native modules that don't work in Expo Go. You need to:
1. Build a development client with EAS Build
2. Install the MediaPipe model asset
3. Test on a real device

## Prerequisites

- Expo account (free)
- EAS CLI installed: `npm install -g eas-cli`
- iOS device for testing (MediaPipe works best on real devices)

## Step 1: Install EAS CLI and Login

```bash
npm install -g eas-cli
eas login
```

## Step 2: Configure EAS Build

```bash
cd mobile
eas build:configure
```

This creates/updates `eas.json` with build profiles.

## Step 3: Download MediaPipe Pose Model

The MediaPipe pose landmarker model needs to be bundled with the app:

1. Download the model from MediaPipe:
   ```bash
   # Create assets directory
   mkdir -p mobile/assets/models
   
   # Download pose landmarker model (lite version for mobile)
   curl -o mobile/assets/models/pose_landmarker_lite.task \
     https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task
   ```

2. Or use the full model (more accurate, larger):
   ```bash
   curl -o mobile/assets/models/pose_landmarker_full.task \
     https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task
   ```

## Step 4: Update Model Path in Code

Update `mobile/src/services/mediapipeNative.ts` to use the correct model path:

```typescript
poseDetector = new MediaPipePose({
  modelAssetPath: require('../assets/models/pose_landmarker_lite.task'),
  numPoses: 1,
  minPoseDetectionConfidence: 0.5,
  minPosePresenceConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
```

**Note**: The actual API may vary based on the `react-native-mediapipe` package version. Check the package documentation for the correct initialization method.

## Step 5: Build iOS Development Client

```bash
cd mobile
eas build --platform ios --profile development
```

This will:
- Build in the cloud (works from Windows!)
- Take ~15-30 minutes
- Generate a `.ipa` file you can install on your iPhone

## Step 6: Install on iPhone

### Option A: Using EAS Build (Recommended)

```bash
eas build:run --platform ios
```

This will:
1. List available builds
2. Let you choose which to install
3. Install via TestFlight or direct download

### Option B: Manual Installation

1. Download the `.ipa` from the EAS Build dashboard
2. Install using:
   - **TestFlight** (if configured)
   - **Apple Configurator 2** (Mac only)
   - **Xcode** (Mac only, drag `.ipa` to Devices window)

## Step 7: Test MediaPipe

1. Open the development client on your iPhone
2. Navigate to the alarm screen
3. Start the camera
4. You should see pose detection working (no mock landmarks)

## Troubleshooting

### MediaPipe Not Initializing

**Symptoms**: Console shows "MediaPipe not initialized" or falls back to mock detection

**Solutions**:
1. Verify native module is loaded:
   ```typescript
   console.log('MediaPipe available:', !!require('react-native-mediapipe'));
   ```

2. Check model path is correct:
   - Model file must be in `mobile/assets/models/`
   - Path in code must match actual file location
   - File must be bundled with app (check build logs)

3. Verify EAS Build included the model:
   - Check build logs for asset bundling
   - Ensure model file is in git (or use `assetBundlePatterns` in `app.json`)

### Model Not Found

**Symptoms**: Error about missing model file

**Solutions**:
1. Add model to `app.json` asset bundle:
   ```json
   {
     "expo": {
       "assetBundlePatterns": [
         "assets/models/*.task"
       ]
     }
   }
   ```

2. Or use a remote URL (downloads at runtime):
   ```typescript
   modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'
   ```

### Frame Processing Errors

**Symptoms**: Errors in frame processor, no pose detection

**Solutions**:
1. Check frame format:
   - MediaPipe expects specific pixel formats
   - May need conversion from vision-camera format

2. Verify frame processor is running:
   - Check console for frame processing logs
   - Ensure camera is active and frames are being captured

3. Check package API compatibility:
   - `react-native-mediapipe` API may have changed
   - Check package README for current API

## Alternative: Use TensorFlow Lite

If MediaPipe continues to have issues, you can use TensorFlow Lite as a fallback:

1. The app already supports TensorFlow Lite
2. Set backend to `tensorflow` in `poseDetectionConfig.ts`
3. TensorFlow Lite models are easier to bundle and have better React Native support

## Next Steps

- Test pose detection accuracy (target: ≥90%)
- Optimize model size (use lite version for faster inference)
- Add error handling for edge cases
- Test in different lighting conditions

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [react-native-mediapipe](https://www.npmjs.com/package/react-native-mediapipe)
- [MediaPipe Pose Landmarker](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker)
- [MediaPipe Models](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker#models)

