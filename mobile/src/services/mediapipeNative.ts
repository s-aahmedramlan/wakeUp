/**
 * Native MediaPipe Integration
 * Uses react-native-mediapipe for pose detection with vision-camera
 */

import { NativeModules, Platform } from 'react-native';

// Try to import native MediaPipe module
let RNMediapipe: any = null;
let MediaPipePose: any = null;

try {
  // Try react-native-mediapipe (cdiddy77's package - better vision-camera support)
  const mediapipeModule = require('react-native-mediapipe');
  RNMediapipe = mediapipeModule;
  MediaPipePose = mediapipeModule.PoseLandmarker;
} catch (error) {
  // Fallback to @thinksys/react-native-mediapipe
  try {
    RNMediapipe = require('@thinksys/react-native-mediapipe').default;
  } catch (e) {
    console.warn('MediaPipe native module not installed. Install: npm install react-native-mediapipe');
  }
}

let isInitialized = false;
let onResultsCallback: ((results: any) => void) | null = null;
let poseDetector: any = null;

/**
 * Initialize native MediaPipe pose detection
 * In Expo Go, this will use a mock implementation
 */
export const initializeMediaPipe = async (): Promise<boolean> => {
  // Check if we're in Expo Go (no native modules available)
  const isExpoGo = !RNMediapipe && !MediaPipePose;
  
  if (isExpoGo) {
    console.log('📱 Running in Expo Go - Using mock pose detection');
    console.log('⚠️  MediaPipe requires development build. Mock detection enabled for testing.');
    // Return true to enable mock detection
    isInitialized = true;
    return true;
  }
  
  if (!RNMediapipe && !MediaPipePose) {
    console.warn('MediaPipe native module not available. Install: npm install react-native-mediapipe');
    return false;
  }

  try {
    // Initialize MediaPipe Pose Landmarker
    if (MediaPipePose) {
      // Using react-native-mediapipe (cdiddy77's package)
      poseDetector = new MediaPipePose({
        modelAssetPath: 'pose_landmarker.task', // Will be bundled with app
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      
      console.log('MediaPipe Pose initialized successfully');
      isInitialized = true;
      return true;
    } else if (RNMediapipe) {
      // Using @thinksys/react-native-mediapipe
      // Initialize based on their API
      console.log('MediaPipe initialized (ThinkSys package)');
      isInitialized = true;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error initializing MediaPipe:', error);
    isInitialized = false;
    return false;
  }
};

/**
 * Start pose detection with MediaPipe
 */
export const startMediaPipeDetection = (
  onResults: (results: any) => void,
  config?: {
    modelComplexity?: 0 | 1 | 2;
    minDetectionConfidence?: number;
    minTrackingConfidence?: number;
  }
): void => {
  if (!RNMediapipe || !isInitialized) {
    console.warn('MediaPipe not initialized');
    return;
  }

  onResultsCallback = onResults;

  // Start MediaPipe detection
  // This will vary based on the actual package API
  // Example structure:
  /*
  RNMediapipe.startPoseDetection({
    modelComplexity: config?.modelComplexity || 1,
    minDetectionConfidence: config?.minDetectionConfidence || 0.5,
    minTrackingConfidence: config?.minTrackingConfidence || 0.5,
    onLandmark: (landmarks: any) => {
      // Convert landmarks to MediaPipe format
      const results = {
        poseLandmarks: convertLandmarksToMediaPipeFormat(landmarks),
      };
      if (onResultsCallback) {
        onResultsCallback(results);
      }
    },
  });
  */
};

/**
 * Stop MediaPipe detection
 */
export const stopMediaPipeDetection = (): void => {
  if (!RNMediapipe) return;

  // Stop detection
  // RNMediapipe.stopPoseDetection();
  onResultsCallback = null;
};

/**
 * Generate mock pose landmarks for Expo Go testing
 */
const generateMockLandmarks = (): any[] => {
  // Generate realistic mock landmarks for push-up position
  // These simulate a person in push-up position
  const time = Date.now();
  const cycle = Math.sin(time / 1000) * 0.3 + 0.5; // Oscillating between 0.2 and 0.8
  
  // Simulate push-up motion: cycle between down (low angle) and up (high angle)
  const isDown = cycle < 0.4;
  const elbowAngle = isDown ? 70 + cycle * 20 : 150 + cycle * 20; // 70-90 (down) or 150-170 (up)
  
  // Generate landmarks based on angle
  const shoulderY = 0.3;
  const elbowY = shoulderY + (elbowAngle < 90 ? 0.15 : 0.05);
  const wristY = elbowY + (elbowAngle < 90 ? 0.1 : 0.15);
  
  return [
    { x: 0.5, y: 0.1, z: 0, visibility: 0.9 }, // nose
    { x: 0.48, y: 0.12, z: 0, visibility: 0.9 }, // left eye
    { x: 0.52, y: 0.12, z: 0, visibility: 0.9 }, // right eye
    { x: 0.45, y: 0.15, z: 0, visibility: 0.8 }, // left ear
    { x: 0.55, y: 0.15, z: 0, visibility: 0.8 }, // right ear
    { x: 0.4, y: shoulderY, z: 0, visibility: 0.95 }, // left shoulder
    { x: 0.6, y: shoulderY, z: 0, visibility: 0.95 }, // right shoulder
    { x: 0.35, y: elbowY, z: 0, visibility: 0.9 }, // left elbow
    { x: 0.65, y: elbowY, z: 0, visibility: 0.9 }, // right elbow
    { x: 0.3, y: wristY, z: 0, visibility: 0.85 }, // left wrist
    { x: 0.7, y: wristY, z: 0, visibility: 0.85 }, // right wrist
    { x: 0.45, y: 0.5, z: 0, visibility: 0.8 }, // left hip
    { x: 0.55, y: 0.5, z: 0, visibility: 0.8 }, // right hip
    { x: 0.4, y: 0.7, z: 0, visibility: 0.7 }, // left knee
    { x: 0.6, y: 0.7, z: 0, visibility: 0.7 }, // right knee
    { x: 0.35, y: 0.9, z: 0, visibility: 0.6 }, // left ankle
    { x: 0.65, y: 0.9, z: 0, visibility: 0.6 }, // right ankle
  ];
};

/**
 * Process a vision-camera frame with MediaPipe
 * This integrates with vision-camera frame processor
 * In Expo Go, uses mock detection
 */
export const processFrameWithMediaPipe = async (
  frame: any, // vision-camera Frame
  onResults: (results: any) => void
): Promise<void> => {
  if (!isInitialized) {
    console.warn('MediaPipe not initialized');
    return;
  }

  // Check if we're in Expo Go (mock mode)
  const isExpoGo = !RNMediapipe && !poseDetector;
  
  if (isExpoGo) {
    // Use mock landmarks for Expo Go
    const mockLandmarks = generateMockLandmarks();
    onResults({ poseLandmarks: mockLandmarks });
    return;
  }

  try {
    if (poseDetector) {
      // react-native-mediapipe (cdiddy77's package)
      // Process frame directly
      const pixelData = frame.toArrayBuffer();
      const width = frame.width;
      const height = frame.height;
      
      // Process with MediaPipe
      const results = await poseDetector.detect(pixelData, width, height);
      
      // Convert to MediaPipe format
      if (results && results.landmarks) {
        const poseLandmarks = convertLandmarksToMediaPipeFormat(results.landmarks);
        onResults({ poseLandmarks });
      }
    } else if (RNMediapipe) {
      // @thinksys/react-native-mediapipe
      // Process frame
      const imageData = await frame.toArrayBuffer();
      const results = await RNMediapipe.processFrame(imageData);
      
      if (results && results.landmarks) {
        const poseLandmarks = convertLandmarksToMediaPipeFormat(results.landmarks);
        onResults({ poseLandmarks });
      }
    }
  } catch (error) {
    console.error('Error processing frame with MediaPipe:', error);
    // Silently fail - don't crash the app
  }
};

/**
 * Convert package-specific landmarks to MediaPipe format
 */
const convertLandmarksToMediaPipeFormat = (landmarks: any[]): any[] => {
  // Convert landmarks from package format to MediaPipe format
  // MediaPipe format: [{x, y, z, visibility}, ...]
  return landmarks.map((landmark) => ({
    x: landmark.x || 0,
    y: landmark.y || 0,
    z: landmark.z || 0,
    visibility: landmark.visibility || landmark.score || 1.0,
  }));
};

/**
 * Cleanup MediaPipe resources
 */
export const cleanupMediaPipe = (): void => {
  stopMediaPipeDetection();
  isInitialized = false;
};

