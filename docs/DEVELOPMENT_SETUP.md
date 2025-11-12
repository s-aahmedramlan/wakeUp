# Development Setup Guide

## Current Status

✅ **Dependencies installed** - All packages including MediaPipe
✅ **Native code generated** - `npx expo prebuild` completed
✅ **Expo server running** - Metro bundler at `http://localhost:8081`

## Running the App

### Option 1: Expo Go (Quick Test - Limited)

**Note**: MediaPipe won't work in Expo Go, but you can test UI/navigation.

1. Install Expo Go on your phone
2. Scan QR code from terminal
3. App will load (MediaPipe features won't work)

### Option 2: Development Build (Required for MediaPipe)

#### Android Setup

1. **Install Android Studio**:
   - Download from https://developer.android.com/studio
   - Install Android SDK (API 33+)
   - Set `ANDROID_HOME` environment variable

2. **Set up Android SDK**:
   ```bash
   # Windows PowerShell
   $env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
   ```

3. **Build and run**:
   ```bash
   cd mobile
   npx expo run:android
   ```

#### iOS Setup (Mac only)

1. **Install Xcode** from App Store
2. **Install CocoaPods**:
   ```bash
   sudo gem install cocoapods
   ```

3. **Build and run**:
   ```bash
   cd mobile
   npx expo run:ios
   ```

## What's Working

- ✅ Expo development server
- ✅ All dependencies installed
- ✅ Native code generated
- ⏳ MediaPipe integration (requires dev build)

## Next Steps

1. Set up Android Studio or Xcode
2. Build development client: `npx expo run:android` or `npx expo run:ios`
3. Test MediaPipe pose detection
4. Verify push-up counting accuracy

## Troubleshooting

### Android SDK Not Found
- Install Android Studio
- Set `ANDROID_HOME` environment variable
- Add SDK tools to PATH

### Build Errors
- Clean build: `cd android && ./gradlew clean`
- Rebuild: `npx expo prebuild --clean`

### MediaPipe Not Working
- Ensure you're using development build (not Expo Go)
- Check native modules are linked: `npx expo prebuild`
- Rebuild: `npx expo run:android --clean`


