import { useEffect, useRef, useState, useCallback } from 'react';
import { useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated';
import { PushupState } from '../types';
import {
  extractLandmarks,
  calculateAverageElbowAngle,
  isInPushupPosition,
  isDownPosition,
  isUpPosition,
} from '../services/poseDetection';
import { PoseDetectionManager } from '../services/poseDetectionManager';
import { DEFAULT_CONFIG } from '../services/poseDetectionConfig';

// MediaPipe Pose Detection Hook
// Uses MediaPipe to detect pose landmarks and count push-ups

interface UsePoseDetectorOptions {
  onRepComplete?: (repCount: number) => void;
  onPushupComplete?: () => void;
  targetReps?: number;
}

export const usePoseDetector = (options: UsePoseDetectorOptions = {}) => {
  const { onRepComplete, onPushupComplete, targetReps = 25 } = options;
  const [pushupState, setPushupState] = useState<PushupState>({
    isDown: false,
    repCount: 0,
    isComplete: false,
    lastRepTime: 0,
  });
  const device = useCameraDevice('front');
  
  // Pose detection manager
  const poseManagerRef = useRef<PoseDetectionManager | null>(null);
  
  // State refs for worklet access
  const isDownRef = useRef(false);
  const repCountRef = useRef(0);
  const lastRepTimeRef = useRef(0);
  const lastAngleRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const debounceFramesRef = useRef(0);

  // Update refs when state changes
  useEffect(() => {
    isDownRef.current = pushupState.isDown;
    repCountRef.current = pushupState.repCount;
    lastRepTimeRef.current = pushupState.lastRepTime;
  }, [pushupState]);

  // Process pose detection results from MediaPipe
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processPoseResults = useCallback((results: any) => {
    // Extract landmarks from MediaPipe results
    const landmarks = extractLandmarks(results);
    if (!landmarks) {
      return; // No pose detected
    }

    // Check if user is in push-up position
    if (!isInPushupPosition(landmarks)) {
      return; // Not in push-up position
    }

    // Calculate elbow angle
    const elbowAngle = calculateAverageElbowAngle(landmarks);
    if (elbowAngle === null) {
      return; // Can't calculate angle
    }

    lastAngleRef.current = elbowAngle;
    frameCountRef.current += 1;

    // Debounce: Only process every 5 frames to reduce computation
    if (frameCountRef.current % 5 !== 0) {
      return;
    }

    const currentTime = Date.now();
    const wasDown = isDownRef.current;
    const isCurrentlyDown = isDownPosition(elbowAngle, 90);
    const isCurrentlyUp = isUpPosition(elbowAngle, 160);

    // State machine: Detect transitions from down to up
    if (!wasDown && isCurrentlyDown) {
      // Entered down position
      isDownRef.current = true;
      debounceFramesRef.current = 0;
    } else if (wasDown && isCurrentlyUp) {
      // Transitioned from down to up - count a rep!
      debounceFramesRef.current += 1;
      
      // Require 3 consecutive frames in up position to count rep (debouncing)
      if (debounceFramesRef.current >= 3 && repCountRef.current < targetReps) {
        const newRepCount = repCountRef.current + 1;
        repCountRef.current = newRepCount;
        lastRepTimeRef.current = currentTime;
        isDownRef.current = false;
        debounceFramesRef.current = 0;

        setPushupState({
          isDown: false,
          repCount: newRepCount,
          isComplete: newRepCount >= targetReps,
          lastRepTime: currentTime,
        });

        if (onRepComplete) {
          onRepComplete(newRepCount);
        }

        if (newRepCount >= targetReps && onPushupComplete) {
          onPushupComplete();
        }
      }
    } else if (wasDown && !isCurrentlyUp && !isCurrentlyDown) {
      // Reset debounce if we're not clearly in up position
      debounceFramesRef.current = 0;
    }
  }, [targetReps, onRepComplete, onPushupComplete]);

  // MediaPipe pose results processor
  // This will be called when MediaPipe detects a pose
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const poseResultsRef = useRef<(results: any) => void>(processPoseResults);

  useEffect(() => {
    poseResultsRef.current = processPoseResults;
  }, [processPoseResults]);

  // Expose processPoseResults so pose detection can call it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePoseResults = useCallback((results: any) => {
    processPoseResults(results);
  }, [processPoseResults]);

  // Backend ref for worklet access
  const backendRef = useRef<'mediapipe' | 'tensorflow' | null>(null);

  // Initialize pose detection manager
  useEffect(() => {
    const manager = new PoseDetectionManager(DEFAULT_CONFIG);
    poseManagerRef.current = manager;

    // Initialize with results callback
    manager.initialize(handlePoseResults).then((initialized) => {
      if (initialized) {
        const backend = manager.getBackend();
        backendRef.current = backend;
        console.log(`✅ Pose detection initialized with backend: ${backend}`);
        
        // If MediaPipe, start detection
        if (backend === 'mediapipe') {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { startMediaPipeDetection } = require('../services/mediapipeNative');
          startMediaPipeDetection(handlePoseResults, {
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
        }
      } else {
        console.warn('⚠️ Pose detection initialization failed - using placeholder');
        backendRef.current = null;
      }
    });

    return () => {
      manager.cleanup();
      backendRef.current = null;
    };
  }, [handlePoseResults]);

  // Process frame for TensorFlow (MediaPipe handles automatically)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processFrame = useCallback((frame: any) => {
    if (poseManagerRef.current && backendRef.current === 'tensorflow') {
      poseManagerRef.current.processFrame(frame);
    }
  }, []);

  // Process frame for MediaPipe (needs explicit processing in frame processor)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processMediaPipeFrame = useCallback((frame: any) => {
    if (poseManagerRef.current && backendRef.current === 'mediapipe') {
      poseManagerRef.current.processFrame(frame);
    }
  }, []);

  // Frame processor for vision-camera
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    // Process frame with active backend
    if (backendRef.current === 'tensorflow') {
      runOnJS(processFrame)(frame);
    } else if (backendRef.current === 'mediapipe') {
      // MediaPipe also needs frame processing for vision-camera integration
      runOnJS(processMediaPipeFrame)(frame);
    }
  }, [processFrame, processMediaPipeFrame]);

  const resetDetection = useCallback(() => {
    const initialState = {
      isDown: false,
      repCount: 0,
      isComplete: false,
      lastRepTime: 0,
    };
    setPushupState(initialState);
    repCountRef.current = 0;
    lastRepTimeRef.current = 0;
    isDownRef.current = false;
    frameCountRef.current = 0;
    debounceFramesRef.current = 0;
    lastAngleRef.current = null;
  }, []);

  return {
    device,
    frameProcessor,
    pushupState,
    resetDetection,
    processPoseResults: handlePoseResults, // Expose for MediaPipe integration
  };
};

// Helper function to calculate elbow angle from keypoints
export const calculateElbowAngle = (
  shoulder: PosePoint,
  elbow: PosePoint,
  wrist: PosePoint
): number => {
  // Calculate angle at elbow using vectors
  const vector1 = {
    x: shoulder.x - elbow.x,
    y: shoulder.y - elbow.y,
  };
  const vector2 = {
    x: wrist.x - elbow.x,
    y: wrist.y - elbow.y,
  };

  const dot = vector1.x * vector2.x + vector1.y * vector2.y;
  const mag1 = Math.sqrt(vector1.x ** 2 + vector1.y ** 2);
  const mag2 = Math.sqrt(vector2.x ** 2 + vector2.y ** 2);

  if (mag1 === 0 || mag2 === 0) return 180;

  const cosAngle = dot / (mag1 * mag2);
  const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI);
  return angle;
};

