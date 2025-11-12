/**
 * Frame Conversion Utilities
 * Converts react-native-vision-camera frames to formats usable by pose detection models
 */

import { Frame } from 'react-native-vision-camera';
import * as tf from '@tensorflow/tfjs';

/**
 * Convert vision-camera frame to TensorFlow tensor
 * This extracts pixel data and creates a tensor suitable for pose estimation models
 */
export const frameToTensor = async (frame: Frame, targetSize: number = 256): Promise<tf.Tensor4D> => {
  try {
    // Extract pixel data from frame
    // Note: react-native-vision-camera v4+ provides pixel data access
    const pixelData = frame.toArrayBuffer();
    
    // Convert to tensor
    // Frame format: RGBA or YUV, need to convert to RGB
    const width = frame.width;
    const height = frame.height;
    
    // Create tensor from pixel data
    // Note: This is a simplified version - actual implementation depends on frame format
    const imageTensor = tf.browser.fromPixels({
      data: new Uint8Array(pixelData),
      width,
      height,
    } as any);
    
    // Resize to target size (MoveNet expects 256x256)
    const resized = tf.image.resizeBilinear(imageTensor, [targetSize, targetSize]);
    
    // Normalize to 0-1 range
    const normalized = resized.div(255.0);
    
    // Add batch dimension
    const batched = normalized.expandDims(0) as tf.Tensor4D;
    
    // Cleanup intermediate tensors
    imageTensor.dispose();
    resized.dispose();
    normalized.dispose();
    
    return batched;
  } catch (error) {
    console.error('Error converting frame to tensor:', error);
    throw error;
  }
};

/**
 * Convert frame to image data format (for MediaPipe if needed)
 */
export const frameToImageData = async (frame: Frame): Promise<ImageData> => {
  try {
    const pixelData = frame.toArrayBuffer();
    const width = frame.width;
    const height = frame.height;
    
    // Create ImageData object
    // Note: ImageData is a web API, may need polyfill for React Native
    return new ImageData(new Uint8ClampedArray(pixelData), width, height);
  } catch (error) {
    console.error('Error converting frame to ImageData:', error);
    throw error;
  }
};


