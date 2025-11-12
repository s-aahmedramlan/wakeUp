# Quick Android Development Build Setup

## Current Status
❌ Android SDK not found - Need to install Android Studio

## Step 1: Install Android Studio

1. **Download**: https://developer.android.com/studio
2. **Run installer** and follow setup wizard
3. **Install these components**:
   - ✅ Android SDK
   - ✅ Android SDK Platform (API 33)
   - ✅ Android Virtual Device (AVD)
   - ✅ Performance (Intel HAXM) - if available

## Step 2: Set Environment Variables

After installing Android Studio, run these commands in PowerShell:

```powershell
# Set for current session
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"

# Verify
adb version
```

## Step 3: Create Virtual Device (Optional)

1. Open Android Studio
2. Tools → Device Manager → Create Device
3. Choose Pixel 5 or similar
4. Select API 33 system image
5. Finish

## Step 4: Build Development Client

```bash
cd mobile
npx expo run:android
```

## Alternative: Use Physical Device

1. Enable Developer Options on your Android phone
2. Enable USB Debugging
3. Connect via USB
4. Run: `npx expo run:android`

## What You'll Get

✅ Real MediaPipe pose detection
✅ Native camera processing
✅ Actual push-up counting
✅ Full app functionality

## Need Help?

See `docs/ANDROID_DEV_BUILD_SETUP.md` for detailed instructions.


