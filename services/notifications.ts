import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

export async function scheduleOutfitFeedbackNotification() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const granted = await requestNotificationPermission();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "How was your outfit today?",
      body: "Tap to rate if it kept you comfortable.",
      data: { type: "outfit_feedback" },
      sound: true,
    },
    trigger: {
      type: "daily",
      hour: 21,
      minute: 0,
    } as any,
  });
}

export async function cancelOutfitFeedbackNotification() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}