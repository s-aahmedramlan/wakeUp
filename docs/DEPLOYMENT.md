# RiseRite Deployment Guide

This guide covers deploying RiseRite to iOS and Android devices.

## Prerequisites

- Expo account (free at https://expo.dev)
- EAS CLI installed: `npm install -g eas-cli`
- iOS device for testing (or Android device)
- Apple Developer account (free personal account works for development)

## Quick Start

### 1. Login to Expo

```bash
cd mobile
eas login
```

If you don't have an account, sign up at https://expo.dev

### 2. Build Development Client

**For iOS:**
```bash
eas build --platform ios --profile development
```

**For Android:**
```bash
eas build --platform android --profile development
```

**For Both:**
```bash
eas build --platform all --profile development
```

### 3. Install on Device

After the build completes (15-30 minutes), you'll get:
- Download link for the `.ipa` (iOS) or `.apk` (Android)
- QR code to scan with your device
- Option to install via TestFlight (iOS)

**Direct Install:**
```bash
eas build:run --platform ios
```

## Build Profiles

The app uses three build profiles (configured in `mobile/eas.json`):

### Development
- **Purpose**: Testing with native modules (MediaPipe)
- **Distribution**: Internal
- **Features**: Dev client, debugging enabled
- **Command**: `eas build --platform ios --profile development`

### Preview
- **Purpose**: Internal testing, beta testing
- **Distribution**: Internal
- **Features**: Production-like build
- **Command**: `eas build --platform ios --profile preview`

### Production
- **Purpose**: App Store / Play Store release
- **Distribution**: Store
- **Features**: Optimized, signed for release
- **Command**: `eas build --platform ios --profile production`

## What Gets Built

✅ **Native Modules**: MediaPipe pose detection  
✅ **Camera Access**: react-native-vision-camera  
✅ **Notifications**: expo-notifications  
✅ **Audio**: expo-av for alarms  
✅ **Database**: expo-sqlite for local storage  
✅ **All Dependencies**: Bundled and optimized  

## Build Status

Check build status:
```bash
eas build:list
```

View build logs:
```bash
eas build:view [BUILD_ID]
```

## Troubleshooting

### Build Fails

1. **Check build logs**:
   ```bash
   eas build:view [BUILD_ID]
   ```

2. **Verify dependencies**:
   ```bash
   cd mobile
   npm install
   ```

3. **Check `eas.json` configuration**:
   - Ensure build profiles are correct
   - Verify platform-specific settings

### Can't Install on Device

1. **iOS**: Ensure device is registered in Apple Developer account
2. **Android**: Enable "Install from unknown sources" if needed
3. **Check device compatibility**: iOS 13+ / Android 8+

### MediaPipe Not Working

1. **Verify development build**: MediaPipe doesn't work in Expo Go
2. **Check camera permissions**: App should request camera access
3. **Review logs**: Check console for MediaPipe initialization errors

## Environment Variables

For backend API connection, set in `mobile/src/services/api.ts`:
- `API_BASE_URL`: Backend API endpoint (default: `http://localhost:8000`)

For production, update to your deployed backend URL.

## Backend Deployment

The FastAPI backend should be deployed separately:

1. **AWS EC2 / Lambda**: Deploy `api/fastapi/` to your hosting
2. **Environment Variables**: Set AWS credentials and region
3. **DynamoDB**: Ensure table exists in correct region
4. **Update Mobile App**: Point `API_BASE_URL` to deployed backend

## Next Steps After Build

1. **Test on Device**: Verify all features work
2. **Test MediaPipe**: Ensure pose detection works correctly
3. **Test Alarms**: Verify notifications and camera activation
4. **Test Backend**: Ensure session logging works
5. **Submit to Stores**: Use `production` profile for App Store/Play Store

## Cost

- **EAS Build Free Tier**: Limited builds per month
- **Development Builds**: Usually free
- **Production Builds**: May require paid plan
- Check: https://expo.dev/pricing

## Resources

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Build Quick Start](docs/EAS_BUILD_QUICKSTART.md)
- [iOS Build on Windows](docs/IOS_BUILD_WINDOWS.md)
- [MediaPipe Setup](docs/MEDIAPIPE_EAS_SETUP.md)

