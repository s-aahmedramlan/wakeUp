import { PosePoint } from '../types';

/**
 * Calculate elbow angle from three keypoints
 * Returns angle in degrees (0-180)
 */
export const calculateElbowAngle = (
  shoulder: PosePoint,
  elbow: PosePoint,
  wrist: PosePoint
): number => {
  // Calculate vectors
  const vector1 = {
    x: shoulder.x - elbow.x,
    y: shoulder.y - elbow.y,
  };
  const vector2 = {
    x: wrist.x - elbow.x,
    y: wrist.y - elbow.y,
  };

  // Calculate dot product
  const dot = vector1.x * vector2.x + vector1.y * vector2.y;
  
  // Calculate magnitudes
  const mag1 = Math.sqrt(vector1.x ** 2 + vector1.y ** 2);
  const mag2 = Math.sqrt(vector2.x ** 2 + vector2.y ** 2);

  if (mag1 === 0 || mag2 === 0) return 180;

  // Calculate angle
  const cosAngle = dot / (mag1 * mag2);
  const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI);
  return angle;
};

/**
 * Detect if user is in down position (elbow angle < threshold)
 */
export const isDownPosition = (elbowAngle: number, threshold: number = 90): boolean => {
  return elbowAngle < threshold;
};

/**
 * Detect if user is in up position (elbow angle > threshold)
 */
export const isUpPosition = (elbowAngle: number, threshold: number = 160): boolean => {
  return elbowAngle > threshold;
};

/**
 * Validate push-up form
 * Checks if keypoints are in reasonable positions
 */
export const validateForm = (keypoints: {
  leftShoulder: PosePoint;
  rightShoulder: PosePoint;
  leftElbow: PosePoint;
  rightElbow: PosePoint;
  leftWrist: PosePoint;
  rightWrist: PosePoint;
}): { isValid: boolean; reason?: string } => {
  // Check if keypoints are visible
  const minVisibility = 0.5;
  const allVisible =
    (keypoints.leftShoulder.visibility ?? 1) > minVisibility &&
    (keypoints.rightShoulder.visibility ?? 1) > minVisibility &&
    (keypoints.leftElbow.visibility ?? 1) > minVisibility &&
    (keypoints.rightElbow.visibility ?? 1) > minVisibility &&
    (keypoints.leftWrist.visibility ?? 1) > minVisibility &&
    (keypoints.rightWrist.visibility ?? 1) > minVisibility;

  if (!allVisible) {
    return { isValid: false, reason: 'Keypoints not visible' };
  }

  // Check if wrists are below shoulders (for push-up position)
  const leftWristBelow = keypoints.leftWrist.y > keypoints.leftShoulder.y;
  const rightWristBelow = keypoints.rightWrist.y > keypoints.rightShoulder.y;

  if (!leftWristBelow || !rightWristBelow) {
    return { isValid: false, reason: 'Not in push-up position' };
  }

  return { isValid: true };
};


