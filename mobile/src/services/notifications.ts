import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { AlarmSettings } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permissions not granted');
      return false;
    }

    // Request exact alarm permissions for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('alarm', {
        name: 'Alarm',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

export const scheduleAlarm = async (settings: AlarmSettings): Promise<string | null> => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return null;
    }

    // Cancel existing alarms
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!settings.enabled) {
      return null;
    }

    // Calculate next alarm time
    const now = new Date();
    const alarmTime = new Date();
    alarmTime.setHours(settings.hour, settings.minute, 0, 0);

    // If alarm time has passed today, schedule for tomorrow
    if (alarmTime <= now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

    const trigger = {
      date: alarmTime,
      channelId: Platform.OS === 'android' ? 'alarm' : undefined,
    };

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Wake Up! Time for your morning routine',
        body: 'Complete your push-ups to start the day right',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
        data: { type: 'alarm' },
      },
      trigger,
    });

    return identifier;
  } catch (error) {
    console.error('Error scheduling alarm:', error);
    return null;
  }
};

export const cancelAlarm = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling alarm:', error);
  }
};

export const setupNotificationListener = (
  onNotificationReceived: (notification: Notifications.Notification) => void
) => {
  const subscription = Notifications.addNotificationReceivedListener(onNotificationReceived);
  return () => subscription.remove();
};


