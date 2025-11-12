import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Camera, useCameraPermission } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import { usePoseDetector } from '../hooks/usePoseDetector';
import { useAlarmStore } from '../store/useAlarmStore';
import { playAlarmSound, stopAlarmSound, playMotivationSound } from '../services/audio';
import { logWakeSession } from '../services/api';
import { saveWakeSession } from '../services/database';

export const AlarmRing: React.FC = () => {
  const navigation = useNavigation();
  const { settings, setCurrentSession } = useAlarmStore();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [cameraActive, setCameraActive] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [motivationStarted, setMotivationStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Define handleComplete first using useCallback
  const handleComplete = useCallback(() => {
    setIsComplete(true);
    stopAlarmSound();
    
    const session = {
      userId: 'user|demo', // TODO: Get from auth
      date: new Date().toISOString().split('T')[0],
      pushupCount: repCount,
      brushingSeconds: 0, // Phase 2
      wakeCompleted: true,
      timestamp: Date.now(),
    };

    // Save locally and sync to API
    saveWakeSession(session).catch(console.error);
    logWakeSession(session).catch(console.error);
    setCurrentSession(session);

    Alert.alert(
      'Complete!',
      `Great job! You completed ${repCount} push-ups.`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to home
            navigation.navigate('AlarmSetup' as never);
          },
        },
      ]
    );
  }, [repCount, navigation, setCurrentSession]);

  // Use pose detector hook
  const { device, frameProcessor, pushupState } = usePoseDetector({
    targetReps: settings.pushupTarget,
    onRepComplete: (count) => {
      setRepCount(count);
      // Start motivational audio after first rep
      if (count === 1 && !motivationStarted) {
        setMotivationStarted(true);
        playMotivationSound();
      }
    },
    onPushupComplete: handleComplete,
  });

  useEffect(() => {
    const initializeCamera = async () => {
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          Alert.alert('Camera Permission Required', 'Please enable camera access to use this feature.');
          return;
        }
      }
      setCameraActive(true);
      playAlarmSound();
    };

    initializeCamera();

    return () => {
      stopAlarmSound();
    };
  }, [hasPermission]);

  // Sync rep count from pose detector state
  useEffect(() => {
    if (pushupState.repCount !== repCount) {
      setRepCount(pushupState.repCount);
    }
    // Check if completed
    if (pushupState.isComplete && !isComplete) {
      handleComplete();
    }
  }, [pushupState.repCount, pushupState.isComplete]);

  if (!hasPermission || !device) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (isComplete) {
    return (
      <View style={styles.container}>
        <Text style={styles.completeText}>✓ Complete!</Text>
        <Text style={styles.repText}>You did {repCount} push-ups!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={cameraActive}
        frameProcessor={frameProcessor}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Wake Up!</Text>
        <Text style={styles.subtitle}>Complete {settings.pushupTarget} push-ups</Text>
        <View style={styles.repContainer}>
          <Text style={styles.repCount}>{repCount}</Text>
          <Text style={styles.repLabel}>push-ups</Text>
        </View>
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${(repCount / settings.pushupTarget) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.hint}>
          Position yourself in front of the camera and start doing push-ups
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 40,
  },
  repContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  repCount: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  repLabel: {
    fontSize: 24,
    color: '#fff',
    marginTop: 10,
  },
  progressContainer: {
    width: '80%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 30,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  hint: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
  },
  message: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
  },
  completeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  repText: {
    fontSize: 24,
    color: '#fff',
  },
});

