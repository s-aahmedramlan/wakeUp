# Remaining Tasks for MVP

## ✅ Completed (Just Fixed)

1. **Fixed AlarmRing.tsx Integration**
   - ✅ Properly integrated `usePoseDetector` hook
   - ✅ Fixed missing `device`, `frameProcessor`, and `pushupState` references
   - ✅ Wired up push-up completion detection

2. **Fixed Alarm Navigation**
   - ✅ Added navigation ref in `App.tsx`
   - ✅ Alarm notification now navigates to `AlarmRing` screen

3. **Fixed Audio Transition**
   - ✅ Motivational audio starts after first push-up rep
   - ✅ Alarm sound stops when routine completes

4. **Fixed Completion Handling**
   - ✅ `handleComplete` properly called when target reps reached
   - ✅ Session logging to local DB and API
   - ✅ Navigation back to home screen after completion

## 🔴 Critical - Must Do Next

### 1. EAS Build Setup for iOS (Required for MediaPipe)
**Status**: In Progress - User needs to complete EAS login

**Steps**:
```bash
# 1. Login to Expo
eas login

# 2. Configure EAS Build
cd mobile
eas build:configure

# 3. Build iOS development client
eas build --platform ios --profile development

# 4. Install on iPhone
eas build:run --platform ios
```

**Why**: MediaPipe requires native modules that don't work in Expo Go. Need a development build.

**Documentation**: See `docs/IOS_BUILD_WINDOWS.md` and `docs/EAS_BUILD_QUICKSTART.md`

---

## 🟡 Important - Before MVP Testing

### 2. Test Native Build
- [ ] Install iOS development build on iPhone
- [ ] Test MediaPipe pose detection in real conditions
- [ ] Verify push-up counting accuracy (target: ≥90%)
- [ ] Test in different lighting conditions
- [ ] Verify alarm notification triggers correctly
- [ ] Test audio transitions (alarm → motivation)

### 3. Manual QA Testing
**Acceptance Criteria from ProjectDoc**:
- [ ] Alarm triggers at scheduled time and opens full-screen alarm screen
- [ ] Camera activates and models begin inference without noticeable lag
- [ ] Alarm continues until app verifies configured push-up count (≥90% accuracy in normal lighting)
- [ ] After push-ups begin, alarm fades and motivational audio starts after first rep
- [ ] Session metadata is persisted to DynamoDB and visible in local logs

**Test Scenarios**:
- [ ] Low light conditions
- [ ] Bright backlight
- [ ] Mirror cases (if applicable)
- [ ] Different push-up speeds
- [ ] Partial push-ups (should not count)
- [ ] Complete push-ups (should count)

---

## 🟢 Nice to Have - Phase 0/1 Requirements

### 4. GitHub Actions Pipeline
**Status**: Not Started

**Required for Phase 0**:
- [ ] Create `.github/workflows/lint.yml`
- [ ] Run ESLint on PRs
- [ ] Run Prettier check
- [ ] Run TypeScript type checking

**File to create**: `.github/workflows/lint.yml`

### 5. Code Quality
- [ ] Remove unused files (e.g., `mediapipeBridge.ts` has TODOs)
- [ ] Add error boundaries for camera failures
- [ ] Add loading states for pose detection initialization
- [ ] Improve error messages for users

---

## 🔵 Phase 2 Features (Not in MVP)

These are explicitly Phase 2 features and NOT required for MVP:

- ❌ **Brushing verification** - Phase 2
- ❌ **In-app settings UI** - Partially done (AlarmSetup exists, but brushing settings not needed yet)
- ❌ **Server-side streak computation** - Phase 2
- ❌ **Improved CV heuristics** - Phase 2

---

## 📋 Current MVP Status

### ✅ Completed Features
- ✅ Monorepo structure
- ✅ Expo app setup with TypeScript
- ✅ Alarm scheduling UI (`AlarmSetup.tsx`)
- ✅ Full-screen alarm screen (`AlarmRing.tsx`)
- ✅ Camera integration with `react-native-vision-camera`
- ✅ Pose detection infrastructure (MediaPipe + TensorFlow support)
- ✅ Push-up rep counter with elbow-angle heuristics
- ✅ Motivational audio service
- ✅ Alarm → push-ups → motivational audio transition
- ✅ Local SQLite database for sessions
- ✅ FastAPI backend with DynamoDB integration
- ✅ Session logging to DynamoDB
- ✅ Navigation between screens
- ✅ Alarm notification handling

### ⚠️ Needs Testing
- ⚠️ MediaPipe pose detection on real device (requires native build)
- ⚠️ Push-up counting accuracy (target: ≥90%)
- ⚠️ Alarm notification reliability
- ⚠️ Audio playback on device

### ❌ Not Started
- ❌ GitHub Actions CI/CD pipeline
- ❌ Production error handling improvements
- ❌ User authentication (currently using `user|demo`)

---

## 🎯 Next Steps (Priority Order)

1. **Complete EAS Build** (Critical)
   - User needs to run `eas login` and build iOS app
   - This is blocking real device testing

2. **Test on Real Device** (Critical)
   - Install development build
   - Test all MVP features
   - Verify accuracy meets ≥90% target

3. **GitHub Actions** (Important for Phase 0)
   - Set up basic linting pipeline
   - Can be done in parallel with testing

4. **Polish & Bug Fixes** (Based on Testing)
   - Fix any issues found during testing
   - Improve error handling
   - Add loading states

---

## 📝 Notes

- **Expo Go Limitation**: MediaPipe doesn't work in Expo Go. Mock detection is implemented for UI testing, but real testing requires a development build.

- **Windows + iOS**: User is on Windows but wants iOS build. EAS Build solves this by building in the cloud.

- **Backend**: FastAPI backend is working and connected to DynamoDB. No changes needed for MVP.

- **Authentication**: Currently using hardcoded `user|demo`. Real auth (Cognito) is Phase 3.

---

## 🚀 MVP Completion Checklist

- [x] Core features implemented
- [x] Backend connected
- [x] Database working
- [ ] Native build created
- [ ] Tested on real device
- [ ] Accuracy verified (≥90%)
- [ ] All acceptance criteria met
- [ ] GitHub Actions set up (Phase 0 requirement)

**Estimated Time to MVP**: 
- EAS Build: ~30 minutes (mostly waiting for cloud build)
- Testing: 1-2 hours
- GitHub Actions: 15 minutes
- **Total**: ~2-3 hours

