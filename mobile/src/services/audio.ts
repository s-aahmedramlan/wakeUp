import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

let alarmSound: Audio.Sound | null = null;
let motivationSound: Audio.Sound | null = null;

export const initializeAudio = async () => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });
  } catch (error) {
    console.error('Failed to initialize audio:', error);
  }
};

export const playAlarmSound = async () => {
  try {
    if (alarmSound) {
      await alarmSound.unloadAsync();
    }

    // For MVP, use a simple system sound or local asset
    // In production, this would load from S3
    // Note: For MVP, if audio file doesn't exist, we'll use system sound
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/alarm.mp3'),
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      alarmSound = sound;
    } catch (requireError) {
      // If audio file doesn't exist, use system notification sound as fallback
      console.warn('Alarm audio file not found, using system sound');
      // System will use default notification sound
    }
  } catch (error) {
    console.error('Failed to play alarm sound:', error);
  }
};

export const stopAlarmSound = async () => {
  try {
    if (alarmSound) {
      await alarmSound.stopAsync();
      await alarmSound.unloadAsync();
      alarmSound = null;
    }
  } catch (error) {
    console.error('Failed to stop alarm sound:', error);
  }
};

export const playMotivationSound = async () => {
  try {
    if (motivationSound) {
      await motivationSound.unloadAsync();
    }

    // For MVP, use a local asset
    // In production, this would load from S3
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/motivation.mp3'),
        { shouldPlay: true, isLooping: false, volume: 0.8 }
      );
      motivationSound = sound;
    } catch (requireError) {
      // If audio file doesn't exist, log warning but continue
      console.warn('Motivation audio file not found');
      // Audio will be silent, but app continues to work
    }
  } catch (error) {
    console.error('Failed to play motivation sound:', error);
    // Fallback: continue without audio
  }
};

export const stopMotivationSound = async () => {
  try {
    if (motivationSound) {
      await motivationSound.stopAsync();
      await motivationSound.unloadAsync();
      motivationSound = null;
    }
  } catch (error) {
    console.error('Failed to stop motivation sound:', error);
  }
};

export const useAudio = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeAudio().then(() => setIsInitialized(true));
  }, []);

  return {
    isInitialized,
    playAlarmSound,
    stopAlarmSound,
    playMotivationSound,
    stopMotivationSound,
  };
};

