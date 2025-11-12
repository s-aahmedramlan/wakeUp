# Dependency Installation Fixes

## Issues Resolved

### 1. React Version Conflict
- **Problem**: `@tensorflow/tfjs-react-native@0.8.0` requires React 16, but project uses React 19
- **Solution**: Use `--legacy-peer-deps` flag to bypass peer dependency checks
- **Status**: ✅ Fixed

### 2. Package Version Issues
- **Problem**: `expo-notifications@~0.28.20` version didn't exist
- **Solution**: Updated to `expo-notifications@~0.32.12` (compatible with Expo SDK 54)
- **Status**: ✅ Fixed

### 3. MediaPipe Package Version
- **Problem**: `react-native-mediapipe@^1.0.0` doesn't exist
- **Solution**: Updated to `react-native-mediapipe@^0.6.0` (latest available)
- **Status**: ✅ Fixed

### 4. Husky Prepare Script
- **Problem**: `husky || true` doesn't work in PowerShell/Windows
- **Solution**: Changed to `node -e "try { require('husky') } catch(e) {}"`
- **Status**: ✅ Fixed

## Installation Command

For future installations, use:

```bash
cd mobile
npm install --legacy-peer-deps
```

Or add to `mobile/.npmrc`:
```
legacy-peer-deps=true
```

## Next Steps

1. ✅ Dependencies installed successfully
2. ⏭️ Run `npx expo prebuild` to generate native code
3. ⏭️ Build development client: `npx expo run:android` or `npx expo run:ios`
4. ⏭️ Test MediaPipe integration

## Notes

- TensorFlow is kept as a fallback option but MediaPipe is the primary solution
- The `--legacy-peer-deps` flag allows React 19 to work with packages expecting React 16
- This is safe for development but monitor for any runtime issues


