import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Function to register for push notifications
export const registerForPushNotificationsAsync = async () => {
  try {
    console.log("Device Check:", Constants.isDevice);

    if (!Constants.isDevice) {
      alert('Must use a physical device for Push Notifications');
      return;
    }

    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log("Existing Status:", existingStatus);

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    console.log("Final Status:", finalStatus);

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);

    // Android specific notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  } catch (error) {
    console.error('Error registering for notifications:', error);
  }
};
