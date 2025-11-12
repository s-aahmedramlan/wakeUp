/**
 * MediaPipe Vision Camera Integration
 * Provides frame processor plugin for react-native-vision-camera
 */

import { Frame } from 'react-native-vision-camera';
import { processFrameWithMediaPipe } from './mediapipeNative';

/**
 * Create a frame processor function for vision-camera
 * This processes each frame with MediaPipe pose detection
 */
export const createMediaPipeFrameProcessor = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onResults: (results: any) => void
) => {
  return async (frame: Frame) => {
    'worklet';
    // Process frame with MediaPipe
    // Note: This runs in worklet context, so we need to use runOnJS for callbacks
    await processFrameWithMediaPipe(frame, onResults);
  };
};

/**
 * Initialize MediaPipe for vision-camera
 */
export const initializeMediaPipeForVisionCamera = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onResults: (results: any) => void
): Promise<boolean> => {
  const { initializeMediaPipe, startMediaPipeDetection } = await import('./mediapipeNative');
  
  const initialized = await initializeMediaPipe();
  if (initialized) {
    startMediaPipeDetection(onResults, {
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    return true;
  }
  return false;
};


