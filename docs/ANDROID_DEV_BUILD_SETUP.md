# Android Development Build Setup Guide

## Step-by-Step Setup

### 1. Install Android Studio

1. **Download Android Studio**:
   - Go to: https://developer.android.com/studio
   - Download the Windows installer
   - Run the installer

2. **Install Components**:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)
   - Performance (Intel HAXM) - if available

### 2. Configure Android SDK

1. **Open Android Studio**
2. **Go to**: File → Settings → Appearance & Behavior → System Settings → Android SDK
3. **Install SDK Platforms**:
   - Android 13.0 (Tiramisu) - API Level 33
   - Android 12.0 (S) - API Level 31
4. **Install SDK Tools**:
   - Android SDK Build-Tools
   - Android SDK Platform-Tools
   - Android SDK Command-line Tools
   - Google Play services

### 3. Set Environment Variables

#### Windows PowerShell (Current Session):
```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
```

#### Windows (Permanent):
1. Open **System Properties** → **Environment Variables**
2. Add new **System Variable**:
   - Name: `ANDROID_HOME`
   - Value: `C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk`
3. Edit **Path** variable, add:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`

### 4. Verify Installation

```powershell
# Check ADB
adb version

# Check Android SDK
$env:ANDROID_HOME
```

### 5. Create Android Virtual Device (AVD)

1. **Open Android Studio**
2. **Tools** → **Device Manager**
3. **Create Device**:
   - Choose a device (e.g., Pixel 5)
   - Select system image (API 33 recommended)
   - Finish setup

### 6. Build Development Client

```bash
cd mobile
npx expo run:android
```

This will:
- Build the app with native modules
- Install MediaPipe support
- Launch on emulator or connected device

## Troubleshooting

### "ANDROID_HOME not found"
- Verify environment variable is set
- Restart terminal/PowerShell
- Check path is correct

### "adb not recognized"
- Add platform-tools to PATH
- Restart terminal

### Build Errors
- Clean build: `cd android && ./gradlew clean`
- Rebuild: `npx expo prebuild --clean`
- Then: `npx expo run:android`

### Emulator Issues
- Ensure HAXM is installed (for Intel)
- Check virtualization is enabled in BIOS
- Try different system image

## Quick Start Commands

```bash
# Set environment (PowerShell)
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools"

# Verify
adb devices

# Build and run
cd mobile
npx expo run:android
```

## What This Enables

✅ Real MediaPipe pose detection
✅ Native camera frame processing
✅ Actual push-up counting
✅ Full native module support


