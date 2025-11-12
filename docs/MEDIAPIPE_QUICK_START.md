# MediaPipe Quick Start

Quick reference for setting up MediaPipe with EAS Build.

## Quick Setup (3 Steps)

### 1. Login to EAS
```bash
cd mobile
eas login
```

### 2. Build iOS Development Client
```bash
eas build --platform ios --profile development
```

Wait ~15-30 minutes for cloud build to complete.

### 3. Install on iPhone
```bash
eas build:run --platform ios
```

Or download `.ipa` from EAS dashboard and install manually.

## What's Included

✅ **MediaPipe Integration**
- Native MediaPipe pose detection
- Vision-camera frame processor integration
- Automatic fallback to TensorFlow if MediaPipe unavailable
- Mock detection for Expo Go testing

✅ **EAS Build Configuration**
- Development profile configured
- iOS and Android support
- Native modules enabled

## Testing

1. Open development client on iPhone
2. Navigate to alarm screen
3. Camera should activate
4. Pose detection should work (check console for "✅ MediaPipe Pose initialized")

## Troubleshooting

**MediaPipe not working?**
- Check console for initialization errors
- Verify you're using development build (not Expo Go)
- Check that `react-native-mediapipe` is in `package.json`

**Build failing?**
- Ensure EAS CLI is up to date: `npm install -g eas-cli@latest`
- Check build logs in EAS dashboard
- Verify `app.json` has `react-native-mediapipe` plugin

**Need more help?**
See `docs/MEDIAPIPE_EAS_SETUP.md` for detailed guide.

