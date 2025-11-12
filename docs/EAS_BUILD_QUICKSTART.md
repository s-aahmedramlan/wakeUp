# EAS Build Quick Start for iOS

## ✅ EAS CLI Installed!

Now let's build your iOS app with MediaPipe support.

## Step-by-Step

### 1. Login to Expo

```bash
eas login
```

If you don't have an account:
- Go to https://expo.dev
- Sign up (free)
- Then run `eas login`

### 2. Configure EAS Build

```bash
cd mobile
eas build:configure
```

This will:
- Create `eas.json` (already created)
- Set up build profiles
- Configure for development builds

### 3. Build iOS Development Client

```bash
eas build --platform ios --profile development
```

This will:
- Build your app in the cloud
- Include MediaPipe native modules
- Create a development client
- Take ~10-15 minutes

### 4. Install on Your iPhone

After build completes:

**Option A: Direct Install**
```bash
eas build:run --platform ios
```

**Option B: Download & Install**
- EAS provides a download link
- Download the `.ipa` file
- Install via TestFlight or direct install

## What You'll Get

✅ Real MediaPipe pose detection
✅ Native iOS camera processing
✅ Actual push-up counting
✅ Full app functionality

## Build Profiles

- **development**: For testing (includes dev client)
- **preview**: For internal testing
- **production**: For App Store

## Cost

- **Free tier**: Limited builds/month
- **Development builds**: Usually free
- Check: https://expo.dev/pricing

## Next Commands

```bash
# Login
eas login

# Configure (if needed)
cd mobile
eas build:configure

# Build iOS
eas build --platform ios --profile development

# Check build status
eas build:list

# Install on device
eas build:run --platform ios
```

## Troubleshooting

### Build fails
- Check `eas.json` configuration
- Verify all dependencies are in `package.json`
- Check build logs: `eas build:view`

### Can't install
- Ensure device is registered
- Check iOS version compatibility
- Try TestFlight distribution

## Ready to Build!

Run these commands:

```bash
eas login
cd mobile
eas build --platform ios --profile development
```


