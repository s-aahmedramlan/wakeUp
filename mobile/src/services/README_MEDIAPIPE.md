# MediaPipe Integration Guide

## Current Status

The pose detection logic is implemented and ready for MediaPipe integration. However, MediaPipe JavaScript packages (`@mediapipe/pose`) are designed for web browsers and don't work directly with React Native.

## Integration Options

### Option 1: Native MediaPipe Module (Recommended)

Use a React Native package that provides native MediaPipe bindings:

**Package**: `@thinksys/react-native-mediapipe` or `@gymbrosinc/react-native-mediapipe-pose`

**Setup Steps**:
1. Install package: `npm install @thinksys/react-native-mediapipe`
2. Run `npx expo prebuild` to generate native code
3. Build development client: `npx expo run:android` or `npx expo run:ios`
4. Integrate with `usePoseDetector` hook

**Pros**:
- Real MediaPipe performance
- Native GPU acceleration
- High accuracy

**Cons**:
- Requires native code compilation
- May have platform-specific issues
- More complex setup

### Option 2: TensorFlow Lite (Alternative)

Use TensorFlow Lite with a pose estimation model (already in package.json):

**Setup Steps**:
1. Download pose estimation model (e.g., MoveNet or PoseNet)
2. Load model with `@tensorflow/tfjs-react-native`
3. Process frames in frame processor
4. Extract landmarks similar to MediaPipe format

**Pros**:
- Better React Native support
- Works with expo-dev-client
- Good performance

**Cons**:
- Different model format
- May need model conversion

### Option 3: Custom Native Bridge

Create a custom native module to bridge MediaPipe C++ to React Native.

**Pros**:
- Full control
- Can optimize for specific use case

**Cons**:
- Most complex
- Requires native development knowledge

## Current Implementation

The code is structured to work with any of these approaches:

1. **`usePoseDetector.ts`** - Main hook with pose detection logic
2. **`poseDetection.ts`** - Landmark extraction and angle calculation
3. **`mediapipeBridge.ts`** - Bridge for frame processing (placeholder)
4. **`pushupDetection.ts`** - Utility functions for form validation

## Next Steps

1. Choose integration approach (Option 1 recommended for MediaPipe)
2. Install and configure chosen package
3. Update `mediapipeBridge.ts` with actual implementation
4. Connect frame processor to MediaPipe
5. Test on device

## Testing

Once integrated, test with:
- Different lighting conditions
- Various push-up speeds
- Different camera angles
- Form validation accuracy (target: ≥90%)


