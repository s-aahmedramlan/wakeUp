import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useAlarmStore } from '../store/useAlarmStore';
import { scheduleAlarm, cancelAlarm } from '../services/notifications';

export const AlarmSetup: React.FC = () => {
  const { settings, updateSettings } = useAlarmStore();
  const [hour, setHour] = useState(settings.hour);
  const [minute, setMinute] = useState(settings.minute);
  const [pushupTarget, setPushupTarget] = useState(settings.pushupTarget);
  const [enabled, setEnabled] = useState(settings.enabled);

  useEffect(() => {
    if (enabled) {
      scheduleAlarm({ ...settings, hour, minute, pushupTarget, enabled }).then(
        (id) => {
          if (id) {
            Alert.alert('Success', 'Alarm scheduled successfully!');
          } else {
            Alert.alert('Error', 'Failed to schedule alarm. Please check permissions.');
            setEnabled(false);
          }
        }
      );
    } else {
      cancelAlarm();
    }
  }, [enabled, hour, minute, pushupTarget]);

  const handleSave = () => {
    updateSettings({
      hour,
      minute,
      pushupTarget,
      enabled,
    });
    Alert.alert('Settings Saved', 'Your alarm settings have been updated.');
  };

  const formatTime = (h: number, m: number) => {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alarm Settings</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Enable Alarm</Text>
        <Switch value={enabled} onValueChange={setEnabled} />
      </View>

      {enabled && (
        <>
          <View style={styles.section}>
            <Text style={styles.label}>Time</Text>
            <View style={styles.timeContainer}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => {
                  const newHour = (hour + 1) % 24;
                  setHour(newHour);
                }}
              >
                <Text style={styles.timeText}>↑</Text>
              </TouchableOpacity>
              <Text style={styles.timeDisplay}>{formatTime(hour, minute)}</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => {
                  const newHour = hour === 0 ? 23 : hour - 1;
                  setHour(newHour);
                }}
              >
                <Text style={styles.timeText}>↓</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.timeContainer}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => {
                  const newMinute = (minute + 5) % 60;
                  setMinute(newMinute);
                }}
              >
                <Text style={styles.timeText}>↑</Text>
              </TouchableOpacity>
              <Text style={styles.timeDisplay}>{String(minute).padStart(2, '0')}</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => {
                  const newMinute = minute < 5 ? 55 : minute - 5;
                  setMinute(newMinute);
                }}
              >
                <Text style={styles.timeText}>↓</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Push-up Target: {pushupTarget}</Text>
            <View style={styles.targetContainer}>
              <TouchableOpacity
                style={styles.targetButton}
                onPress={() => setPushupTarget(Math.max(5, pushupTarget - 5))}
              >
                <Text style={styles.targetButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.targetDisplay}>{pushupTarget}</Text>
              <TouchableOpacity
                style={styles.targetButton}
                onPress={() => setPushupTarget(Math.min(100, pushupTarget + 5))}
              >
                <Text style={styles.targetButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Settings</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  timeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  timeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    minWidth: 100,
    textAlign: 'center',
  },
  targetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  targetButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  targetButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  targetDisplay: {
    fontSize: 36,
    fontWeight: 'bold',
    minWidth: 80,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


