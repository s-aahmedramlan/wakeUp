/**
 * TensorFlow Lite Pose Estimation
 * Alternative to MediaPipe for React Native
 * Uses MoveNet or PoseNet model for pose detection
 */

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

let model: tf.GraphModel | null = null;
let isInitialized = false;
let modelLoading = false;

/**
 * Initialize TensorFlow and load pose estimation model
 * Uses MoveNet Thunder model (lightweight, fast, accurate)
 */
export const initializeTensorFlowPose = async (): Promise<boolean> => {
  if (modelLoading) {
    return false; // Already loading
  }

  if (isInitialized && model) {
    return true; // Already initialized
  }

  try {
    modelLoading = true;
    
    // Initialize TensorFlow.js for React Native
    await tf.ready();
    
    // Initialize platform for React Native
    await tf.setBackend('cpu'); // or 'rn-webgl' if available
    
    console.log('Loading TensorFlow pose model...');
    
    // Option 1: Load from URL (requires internet)
    // MoveNet Thunder model - lightweight and fast
    const modelUrl = 'https://tfhub.dev/google/tfjs-model/movenet/singlepose/thunder/4';
    
    try {
      model = await tf.loadGraphModel(modelUrl);
      console.log('TensorFlow model loaded successfully');
      isInitialized = true;
      modelLoading = false;
      return true;
    } catch (urlError) {
      console.warn('Failed to load model from URL, trying local bundle...');
      
      // Option 2: Load from local bundle (for offline use)
      // Download model first and place in mobile/assets/models/
      // const modelPath = bundleResourceIO('models/movenet_thunder/model.json');
      // model = await tf.loadGraphModel(modelPath);
      
      // For now, return false - model needs to be downloaded
      console.warn('TensorFlow model not available. Download model or use MediaPipe.');
      isInitialized = false;
      modelLoading = false;
      return false;
    }
  } catch (error) {
    console.error('Error initializing TensorFlow pose:', error);
    isInitialized = false;
    modelLoading = false;
    return false;
  }
};

/**
 * Process a vision-camera frame and extract pose landmarks
 * Returns landmarks in MediaPipe-compatible format
 */
export const processFrameWithTensorFlow = async (
  frame: any, // vision-camera Frame
  onResults: (results: any) => void
): Promise<void> => {
  if (!model || !isInitialized) {
    console.warn('TensorFlow model not initialized');
    return;
  }

  try {
    const { frameToTensor } = await import('./frameConverter');
    
    // Convert frame to tensor
    const inputSize = 256; // MoveNet input size
    const imageTensor = await frameToTensor(frame, inputSize);
    
    // Run inference
    const predictions = await model.predict(imageTensor) as tf.Tensor;
    const keypoints = await predictions.data();
    
    // Convert to MediaPipe format
    const landmarks = convertToMediaPipeFormat(keypoints, frame.width, frame.height);
    onResults({ poseLandmarks: landmarks });
    
    // Cleanup
    imageTensor.dispose();
    predictions.dispose();
  } catch (error) {
    console.error('Error processing frame with TensorFlow:', error);
    // Silently fail - don't crash the app
  }
};

/**
 * Convert MoveNet keypoints to MediaPipe format
 */
const convertToMediaPipeFormat = (
  keypoints: Float32Array | Int32Array | Uint8Array,
  width: number,
  height: number
): any[] => {
  // MoveNet keypoint order:
  // 0: nose, 1: left_eye, 2: right_eye, 3: left_ear, 4: right_ear,
  // 5: left_shoulder, 6: right_shoulder, 7: left_elbow, 8: right_elbow,
  // 9: left_wrist, 10: right_wrist, 11: left_hip, 12: right_hip,
  // 13: left_knee, 14: right_knee, 15: left_ankle, 16: right_ankle

  const landmarks: any[] = [];
  const numKeypoints = 17;

  for (let i = 0; i < numKeypoints; i++) {
    const y = keypoints[i * 3];
    const x = keypoints[i * 3 + 1];
    const score = keypoints[i * 3 + 2];

    landmarks.push({
      x: x / 256, // Normalize to 0-1
      y: y / 256,
      z: 0,
      visibility: score,
    });
  }

  return landmarks;
};

/**
 * Cleanup TensorFlow resources
 */
export const cleanupTensorFlow = () => {
  if (model) {
    model.dispose();
    model = null;
    isInitialized = false;
  }
};

