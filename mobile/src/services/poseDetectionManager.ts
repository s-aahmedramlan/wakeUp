/**
 * Pose Detection Manager
 * Manages both MediaPipe and TensorFlow Lite implementations
 * Provides unified interface for pose detection
 */

import { PoseDetectionConfig, DEFAULT_CONFIG, getActiveBackend } from './poseDetectionConfig';
import { initializeMediaPipe, startMediaPipeDetection, stopMediaPipeDetection, cleanupMediaPipe } from './mediapipeNative';
import { initializeTensorFlowPose, processFrameWithTensorFlow, cleanupTensorFlow } from './tensorflowPose';

export class PoseDetectionManager {
  private config: PoseDetectionConfig;
  private activeBackend: 'mediapipe' | 'tensorflow' | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onResultsCallback: ((results: any) => void) | null = null;

  constructor(config: PoseDetectionConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

  /**
   * Initialize pose detection with chosen backend
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async initialize(onResults: (results: any) => void): Promise<boolean> {
    this.onResultsCallback = onResults;

    const backend = await getActiveBackend(this.config);
    this.activeBackend = backend;

    if (backend === 'mediapipe') {
      const initialized = await initializeMediaPipe();
      if (initialized) {
        startMediaPipeDetection(onResults, {
          modelComplexity: this.config.modelComplexity,
          minDetectionConfidence: this.config.minDetectionConfidence,
          minTrackingConfidence: this.config.minTrackingConfidence,
        });
        return true;
      } else {
        // Fallback to TensorFlow
        console.log('MediaPipe failed, falling back to TensorFlow');
        this.activeBackend = 'tensorflow';
      }
    }

    if (this.activeBackend === 'tensorflow') {
      const initialized = await initializeTensorFlowPose();
      return initialized;
    }

    return false;
  }

  /**
   * Process a frame (both backends need explicit frame processing with vision-camera)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async processFrame(frame: any): Promise<void> {
    if (!this.onResultsCallback) {
      console.warn('Pose detection not initialized');
      return;
    }

    if (this.activeBackend === 'tensorflow') {
      await processFrameWithTensorFlow(frame, this.onResultsCallback);
    } else if (this.activeBackend === 'mediapipe') {
      const { processFrameWithMediaPipe } = await import('./mediapipeNative');
      await processFrameWithMediaPipe(frame, this.onResultsCallback);
    }
  }

  /**
   * Stop pose detection
   */
  stop(): void {
    if (this.activeBackend === 'mediapipe') {
      stopMediaPipeDetection();
    }
    // TensorFlow doesn't need explicit stop
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.activeBackend === 'mediapipe') {
      cleanupMediaPipe();
    } else if (this.activeBackend === 'tensorflow') {
      cleanupTensorFlow();
    }
    this.activeBackend = null;
    this.onResultsCallback = null;
  }

  /**
   * Get current backend
   */
  getBackend(): 'mediapipe' | 'tensorflow' | null {
    return this.activeBackend;
  }
}

