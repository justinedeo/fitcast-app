import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsReady] = useFonts({
    "Epilogue-Medium": require("../assets/fonts/Epilogue-Medium.ttf"),
    "Epilogue-Bold": require("../assets/fonts/Epilogue-Bold.ttf"),
    "Epilogue-Regular": require("../assets/fonts/Epilogue-Regular.ttf"),
    "Epilogue-SemiBold": require("../assets/fonts/Epilogue-SemiBold.ttf"),
  });

  if (!fontsReady) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
