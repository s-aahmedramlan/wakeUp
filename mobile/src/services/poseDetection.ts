/**
 * MediaPipe Pose Detection Service
 * Processes camera frames to detect pose landmarks and calculate push-up metrics
 */

import { PosePoint } from '../types';

// MediaPipe Pose landmark indices
export const POSE_LANDMARKS = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
} as const;

export interface PoseLandmarks {
  leftShoulder: PosePoint;
  rightShoulder: PosePoint;
  leftElbow: PosePoint;
  rightElbow: PosePoint;
  leftWrist: PosePoint;
  rightWrist: PosePoint;
  leftHip: PosePoint;
  rightHip: PosePoint;
}

/**
 * Extract pose landmarks from MediaPipe results
 */
export const extractLandmarks = (results: any): PoseLandmarks | null => {
  if (!results || !results.poseLandmarks || results.poseLandmarks.length === 0) {
    return null;
  }

  const landmarks = results.poseLandmarks;

  // Check if required landmarks are visible
  const getLandmark = (index: number): PosePoint | null => {
    if (index >= landmarks.length) return null;
    const landmark = landmarks[index];
    if (!landmark || landmark.visibility < 0.5) return null;
    return {
      x: landmark.x,
      y: landmark.y,
      z: landmark.z,
      visibility: landmark.visibility,
    };
  };

  const leftShoulder = getLandmark(POSE_LANDMARKS.LEFT_SHOULDER);
  const rightShoulder = getLandmark(POSE_LANDMARKS.RIGHT_SHOULDER);
  const leftElbow = getLandmark(POSE_LANDMARKS.LEFT_ELBOW);
  const rightElbow = getLandmark(POSE_LANDMARKS.RIGHT_ELBOW);
  const leftWrist = getLandmark(POSE_LANDMARKS.LEFT_WRIST);
  const rightWrist = getLandmark(POSE_LANDMARKS.RIGHT_WRIST);
  const leftHip = getLandmark(POSE_LANDMARKS.LEFT_HIP);
  const rightHip = getLandmark(POSE_LANDMARKS.RIGHT_HIP);

  // Need at least one side's landmarks to be visible
  if (
    (!leftShoulder || !leftElbow || !leftWrist) &&
    (!rightShoulder || !rightElbow || !rightWrist)
  ) {
    return null;
  }

  return {
    leftShoulder: leftShoulder || { x: 0, y: 0, visibility: 0 },
    rightShoulder: rightShoulder || { x: 0, y: 0, visibility: 0 },
    leftElbow: leftElbow || { x: 0, y: 0, visibility: 0 },
    rightElbow: rightElbow || { x: 0, y: 0, visibility: 0 },
    leftWrist: leftWrist || { x: 0, y: 0, visibility: 0 },
    rightWrist: rightWrist || { x: 0, y: 0, visibility: 0 },
    leftHip: leftHip || { x: 0, y: 0, visibility: 0 },
    rightHip: rightHip || { x: 0, y: 0, visibility: 0 },
  };
};

/**
 * Calculate average elbow angle from both arms
 */
export const calculateAverageElbowAngle = (landmarks: PoseLandmarks): number | null => {
  // Import calculateElbowAngle from utils
  const calculateElbowAngle = (
    shoulder: { x: number; y: number },
    elbow: { x: number; y: number },
    wrist: { x: number; y: number }
  ): number => {
    const vector1 = { x: shoulder.x - elbow.x, y: shoulder.y - elbow.y };
    const vector2 = { x: wrist.x - elbow.x, y: wrist.y - elbow.y };
    const dot = vector1.x * vector2.x + vector1.y * vector2.y;
    const mag1 = Math.sqrt(vector1.x ** 2 + vector1.y ** 2);
    const mag2 = Math.sqrt(vector2.x ** 2 + vector2.y ** 2);
    if (mag1 === 0 || mag2 === 0) return 180;
    const cosAngle = dot / (mag1 * mag2);
    return Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI);
  };

  const leftAngle = calculateElbowAngle(
    landmarks.leftShoulder,
    landmarks.leftElbow,
    landmarks.leftWrist
  );
  const rightAngle = calculateElbowAngle(
    landmarks.rightShoulder,
    landmarks.rightElbow,
    landmarks.rightWrist
  );

  // Use the side with better visibility, or average if both are visible
  const leftVisible = landmarks.leftShoulder.visibility && landmarks.leftElbow.visibility && landmarks.leftWrist.visibility;
  const rightVisible = landmarks.rightShoulder.visibility && landmarks.rightElbow.visibility && landmarks.rightWrist.visibility;

  if (leftVisible && rightVisible) {
    return (leftAngle + rightAngle) / 2;
  } else if (leftVisible) {
    return leftAngle;
  } else if (rightVisible) {
    return rightAngle;
  }

  return null;
};

/**
 * Detect if user is in push-up position
 */
export const isInPushupPosition = (landmarks: PoseLandmarks): boolean => {
  // Check if wrists are below shoulders (indicating push-up position)
  const leftWristBelow = landmarks.leftWrist.y > landmarks.leftShoulder.y;
  const rightWristBelow = landmarks.rightWrist.y > landmarks.rightShoulder.y;

  // Check if body is roughly horizontal (shoulders and hips at similar height)
  const shoulderHeight = (landmarks.leftShoulder.y + landmarks.rightShoulder.y) / 2;
  const hipHeight = (landmarks.leftHip.y + landmarks.rightHip.y) / 2;
  const bodyAngle = Math.abs(shoulderHeight - hipHeight);

  // Body should be relatively horizontal (difference < 0.2)
  return (leftWristBelow || rightWristBelow) && bodyAngle < 0.2;
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

