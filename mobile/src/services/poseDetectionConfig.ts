/**
 * Pose Detection Configuration
 * Switch between MediaPipe and TensorFlow Lite implementations
 */

export type PoseDetectionBackend = 'mediapipe' | 'tensorflow' | 'auto';

export interface PoseDetectionConfig {
  backend: PoseDetectionBackend;
  modelComplexity: 0 | 1 | 2; // For MediaPipe: 0=fast, 1=balanced, 2=accurate
  minDetectionConfidence: number; // 0-1
  minTrackingConfidence: number; // 0-1
  enableSmoothing: boolean;
}

export const DEFAULT_CONFIG: PoseDetectionConfig = {
  backend: 'auto', // Will try MediaPipe first, fallback to TensorFlow, then mock in Expo Go
  modelComplexity: 1, // Balanced performance/accuracy
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  enableSmoothing: true,
};

/**
 * Get the active backend based on config
 */
export const getActiveBackend = async (
  config: PoseDetectionConfig
): Promise<'mediapipe' | 'tensorflow'> => {
  if (config.backend === 'auto') {
    // Try MediaPipe first, fallback to TensorFlow
    try {
      const { initializeMediaPipe } = await import('./mediapipeNative');
      const initialized = await initializeMediaPipe();
      if (initialized) {
        return 'mediapipe';
      }
    } catch (error) {
      console.log('MediaPipe not available, using TensorFlow Lite');
    }
    return 'tensorflow';
  }
  return config.backend;
};

