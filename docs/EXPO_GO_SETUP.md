# Expo Go Setup & Limitations

## Current Setup

✅ **Expo Go Compatible** - App works in Expo Go with mock pose detection
⚠️ **MediaPipe Limitation** - Real MediaPipe requires development build

## What Works in Expo Go

- ✅ Alarm scheduling UI
- ✅ Alarm ring screen
- ✅ Camera view (basic)
- ✅ Mock pose detection (simulated push-ups)
- ✅ Audio playback
- ✅ Navigation
- ✅ Settings UI
- ✅ Session logging (if backend is running)

## What Doesn't Work in Expo Go

- ❌ Real MediaPipe pose detection (requires native modules)
- ❌ Real push-up counting (using mock data)
- ❌ Native camera frame processing (limited)

## Mock Detection Mode

When running in Expo Go, the app automatically uses **mock pose detection**:

- Simulates push-up motion (oscillating between down/up positions)
- Generates realistic landmarks
- Allows testing of UI and app flow
- Rep counting will work with mock data

## Testing in Expo Go

1. **Start Expo server** (already running):
   ```bash
   npx expo start
   ```

2. **Scan QR code** with Expo Go app on your phone

3. **Test the app**:
   - Set an alarm
   - Wait for alarm or trigger manually
   - See mock push-up detection
   - Test audio playback
   - Test navigation

## Console Messages

You'll see:
- `📱 Running in Expo Go - Using mock pose detection`
- `⚠️  MediaPipe requires development build. Mock detection enabled for testing.`

## For Real MediaPipe

To use actual MediaPipe pose detection, you need:

1. Development build: `npx expo run:android` or `npx expo run:ios`
2. Android Studio or Xcode setup
3. Native modules compiled

## Current Status

The app is **fully functional in Expo Go** with mock detection, allowing you to:
- Test all UI components
- Verify app flow
- Test alarm system
- Test audio playback
- See mock push-up counting

Real MediaPipe will work once you build a development client!


