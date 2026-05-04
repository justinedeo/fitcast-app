import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { useColorScheme } from "react-native";
import "react-native-reanimated";

import OutfitFeedbackModal from "../components/OutfitFeedbackModal";
import { auth, dc } from "../services/firebaseConfig";
import { scheduleOutfitFeedbackNotification } from "../services/notifications";
import { getTodayPost } from "../src/dataconnect-generated";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsReady] = useFonts({
    "Epilogue-Medium": require("../assets/fonts/Epilogue-Medium.ttf"),
    "Epilogue-Bold": require("../assets/fonts/Epilogue-Bold.ttf"),
    "Epilogue-Regular": require("../assets/fonts/Epilogue-Regular.ttf"),
    "Epilogue-SemiBold": require("../assets/fonts/Epilogue-SemiBold.ttf"),
  });

  const [feedbackModal, setFeedbackModal] = useState(false);
  const [todayPostId, setTodayPostId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (user) {
        scheduleOutfitFeedbackNotification();
      }
    });
    return unsubscribe;
  }, []);

  // Handle notification tap
  useEffect(() => {
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const type = response.notification.request.content.data?.type;
        if (type !== "outfit_feedback") return;

        const user = auth.currentUser;
        if (!user) return;

        try {
          const { data } = await getTodayPost(dc, { userId: user.uid });
          const post = data?.posts?.[0];
          if (!post) return;

          const postDate = new Date(post.createdAt).toDateString();
          const today = new Date().toDateString();
          if (postDate !== today) return;

          setTodayPostId(post.id);
          setFeedbackModal(true);
        } catch (e) {
          console.error("Failed to fetch today post:", e);
        }
      }
    );

    return () => {
      responseListener.current?.remove();
    };
  }, [isAuthenticated]);

  if (!fontsReady) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
      </Stack>
      <StatusBar style="auto" />
      {todayPostId && (
        <OutfitFeedbackModal
          visible={feedbackModal}
          postId={todayPostId}
          onClose={() => setFeedbackModal(false)}
        />
      )}
    </ThemeProvider>
  );
}