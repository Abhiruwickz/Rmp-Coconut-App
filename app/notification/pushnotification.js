import * as Notifications from 'expo-notifications';

// Function to send a push notification
export const pushnotification = async (title, body, expoPushToken) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: null, // Send immediately
    });
    console.log('Notification sent successfully!');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
