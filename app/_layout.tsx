import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { Alert, useColorScheme } from "react-native";
import "react-native-reanimated";

import OutfitFeedbackModal from "../components/OutfitFeedbackModal";
import { auth, dc } from "../services/firebaseConfig";
import { scheduleOutfitFeedbackNotification } from "../services/notifications";
import { getTodayPost } from "../src/dataconnect-generated";

type FeedbackWeather = {
  temperature: number | null;
  weatherCondition: string | null;
};

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
  const [feedbackWeather, setFeedbackWeather] = useState<FeedbackWeather>({
    temperature: null,
    weatherCondition: null,
  });

  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  const getCurrentWeatherForFeedback = async (): Promise<FeedbackWeather> => {
    try {
      const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
      if (!API_KEY) {
        return { temperature: null, weatherCondition: null };
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return { temperature: null, weatherCondition: null };
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=${API_KEY}&units=imperial`
      );

      const data = await response.json();

      if (!response.ok) {
        return { temperature: null, weatherCondition: null };
      }

      return {
        temperature: data?.main?.temp ?? null,
        weatherCondition: data?.weather?.[0]?.description ?? null,
      };
    } catch (error) {
      console.error("Feedback weather error:", error);
      return { temperature: null, weatherCondition: null };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        scheduleOutfitFeedbackNotification();
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(async (response) => {
        const type = response.notification.request.content.data?.type;

        if (type !== "outfit_feedback") return;

        const user = auth.currentUser;

        if (!user) {
          console.log("No user signed in for outfit feedback.");
          return;
        }

        try {
          const { data } = await getTodayPost(dc, { userId: user.uid });
          const post = data?.posts?.[0];

          if (!post?.id) {
            Alert.alert(
              "No outfit found",
              "Post an outfit today before rating it."
            );
            return;
          }

          const weather = await getCurrentWeatherForFeedback();

          setTodayPostId(post.id);
          setFeedbackWeather(weather);
          setFeedbackModal(true);
        } catch (error) {
          console.error("Failed to fetch today post:", error);
        }
      });

    return () => {
      responseListener.current?.remove();
    };
  }, []);

  if (!fontsReady) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>

      <StatusBar style="auto" />

      {todayPostId && (
        <OutfitFeedbackModal
          visible={feedbackModal}
          postId={todayPostId}
          temperature={feedbackWeather.temperature}
          weatherCondition={feedbackWeather.weatherCondition}
          onClose={() => setFeedbackModal(false)}
        />
      )}
    </ThemeProvider>
  );
}