import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, dc, NO_CACHE } from "../../services/firebaseConfig";
import { getUserOutfitFeedback } from "../../src/dataconnect-generated";

interface ForecastDay {
  dt: number;
  main: { temp: number };
  weather: Array<{ description: string }>;
  dt_txt: string;
}

interface WeatherData {
  name: string;
  main: { temp: number };
  weather: Array<{ description: string }>;
  forecast?: ForecastDay[];
}

type OutfitFeedback = {
  rating: string;
  temperature?: number | null;
  weatherCondition?: string | null;
  post?: {
    tops?: string[] | null;
    topMaterials?: string[] | null;
    bottoms?: string[] | null;
    bottomMaterials?: string[] | null;
    outerwear?: string[] | null;
    outerwearMaterials?: string[] | null;
  } | null;
};

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");

  const getSimilarFeedback = async (weatherData: WeatherData) => {
    const user = auth.currentUser;
    if (!user) return [];

    try {
      const { data } = await getUserOutfitFeedback(
        dc,
        { userId: user.uid },
        NO_CACHE
      );

      const currentTemp = Math.round(weatherData.main.temp);
      const currentCondition = weatherData.weather[0].description.toLowerCase();

      return ((data?.outfitFeedbacks ?? []) as OutfitFeedback[]).filter(
        (feedback) => {
          const feedbackTemp = feedback.temperature;
          const feedbackCondition =
            feedback.weatherCondition?.toLowerCase() || "";

          const tempIsSimilar =
            typeof feedbackTemp === "number" &&
            Math.abs(feedbackTemp - currentTemp) <= 10;

          const conditionIsSimilar =
            feedbackCondition &&
            (currentCondition.includes(feedbackCondition) ||
              feedbackCondition.includes(currentCondition));

          return tempIsSimilar || conditionIsSimilar;
        }
      );
    } catch (error) {
      console.error("Error loading outfit feedback:", error);
      return [];
    }
  };

  const getAiSuggestions = async (weatherData: WeatherData) => {
    const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

    if (!API_KEY) {
      Alert.alert(
        "Missing API key",
        "Make sure EXPO_PUBLIC_GEMINI_API_KEY is set in your .env file."
      );
      return;
    }

    setAiLoading(true);
    setAiSuggestion("");

    try {
      const forecastSummary =
        weatherData.forecast
          ?.map(
            (day) =>
              `${new Date(day.dt * 1000).toLocaleDateString("en-US", {
                weekday: "short",
              })}: ${Math.round(day.main.temp)}°F, ${
                day.weather[0].description
              }`
          )
          .join("\n") || "No forecast available.";

      const similarFeedback = await getSimilarFeedback(weatherData);

      const feedbackSummary =
        similarFeedback.length > 0
          ? similarFeedback
              .map((feedback, index) => {
                const post = feedback.post;

                return `
Past outfit ${index + 1}
Rating: ${feedback.rating}
Weather: ${Math.round(feedback.temperature ?? 0)}°F, ${
                  feedback.weatherCondition || "unknown"
                }
Tops: ${post?.tops?.join(", ") || "none"}
Top materials: ${post?.topMaterials?.join(", ") || "none"}
Bottoms: ${post?.bottoms?.join(", ") || "none"}
Bottom materials: ${post?.bottomMaterials?.join(", ") || "none"}
Outerwear: ${post?.outerwear?.join(", ") || "none"}
Outerwear materials: ${post?.outerwearMaterials?.join(", ") || "none"}
`;
              })
              .join("\n")
          : "No similar past outfit feedback available.";

      const prompt = `
You are FitCast, a mobile app outfit assistant.

Based on the current weather and any similar past outfit feedback, recommend what the user should wear.

Current weather:
Location: ${weatherData.name}
Temperature: ${Math.round(weatherData.main.temp)}°F
Condition: ${weatherData.weather[0].description}

Upcoming forecast:
${forecastSummary}

Similar past outfit feedback:
${feedbackSummary}

Use past feedback only if it matches similar weather.
If past feedback exists, mention items and materials the user rated perfect in the past.
Avoid items and materials the user rated too warm or too cold. If it is supposed to rain or be windy please mention so they plan accordingly. 
If outerwear is unecessary you don't need to mention it. Also tell them to layer up for wind or weather that would
require adding and taking off layers.

Format your response as clean plain text.

Rules:
- No markdown
- No asterisks
- No bold formatting
- No emojis
- Use simple dashes only for lists
- Keep it short and casual

Structure:
Start with a friendly greeting or "Happy Friday!" if it is Friday. 1 short sentence about the weather.

Tops:
- top idea 1
- top idea 2
- top idea 3

Bottoms:
- bottom idea 1
- bottom idea 2
- bottom idea 3

Outerwear:
- outerwear idea 1
- outerwear idea 2
- outerwear idea 3

Recommended materials: ...

What to avoid: ...
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Gemini error:", data);
        throw new Error(data?.error?.message || "Failed to get AI suggestion.");
      }

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No suggestion available.";

      const cleanedText = text.replace(/\*\*/g, "").replace(/\*/g, "");

      setAiSuggestion(cleanedText);
    } catch (error: any) {
      console.error("AI suggestion error:", error);
      Alert.alert("AI Error", error.message || "Could not get suggestions.");
    } finally {
      setAiLoading(false);
    }
  };

  const fetchWeather = async () => {
    const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

    if (!API_KEY) {
      Alert.alert(
        "Missing API key",
        "Make sure EXPO_PUBLIC_WEATHER_API_KEY is set in your .env file."
      );
      return;
    }

    if (!locationInput.trim()) {
      Alert.alert("Missing location", "Please enter a city name or ZIP code.");
      return;
    }

    setLoading(true);
    setAiSuggestion("");

    try {
      const input = locationInput.trim();
      let lat: number;
      let lon: number;
      let resolvedName = "";

      const isZip = /^\d{5}$/.test(input);

      if (isZip) {
        const zipRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/zip?zip=${input},US&appid=${API_KEY}`
        );
        const zipData = await zipRes.json();

        if (!zipRes.ok) {
          throw new Error(zipData.message || "Could not find that ZIP code.");
        }

        lat = zipData.lat;
        lon = zipData.lon;
        resolvedName = zipData.name;
      } else {
        const geoRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
            input
          )}&limit=1&appid=${API_KEY}`
        );
        const geoData = await geoRes.json();

        if (!geoRes.ok || !geoData.length) {
          throw new Error("Could not find that city.");
        }

        lat = geoData[0].lat;
        lon = geoData[0].lon;
        resolvedName = geoData[0].name;
      }

      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
      );
      const currentData = await currentRes.json();

      if (!currentRes.ok) {
        throw new Error(
          currentData.message || "Failed to fetch current weather."
        );
      }

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
      );
      const forecastData = await forecastRes.json();

      if (!forecastRes.ok) {
        throw new Error(forecastData.message || "Failed to fetch forecast.");
      }

      const dailyForecast = forecastData.list.filter((reading: ForecastDay) =>
        reading.dt_txt.includes("12:00:00")
      );

      const weatherResult: WeatherData = {
        ...currentData,
        name: resolvedName || currentData.name,
        forecast: dailyForecast,
      };

      setWeather(weatherResult);
      await getAiSuggestions(weatherResult);
    } catch (error: any) {
      console.error("Error fetching weather:", error);
      Alert.alert(
        "Error",
        error.message || "Something went wrong while fetching weather."
      );
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to FitCast</Text>
        <Text style={styles.headerSubtitle}>
          Dress sensibly for every kind of weather!
        </Text>
      </View>

      <View style={styles.searchCard}>
        <Text style={styles.searchLabel}>Enter your location</Text>

        <TextInput
          style={styles.input}
          placeholder="City or ZIP code"
          value={locationInput}
          onChangeText={setLocationInput}
          autoCapitalize="words"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={fetchWeather}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Loading..." : "Get Forecast"}
          </Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#59C1BD" />
        </View>
      )}

      {!loading && weather && (
        <>
          <View style={styles.weatherCard}>
            <Text style={styles.cityName}>{weather.name}</Text>
            <Text style={styles.temperature}>
              {Math.round(weather.main.temp)}°F
            </Text>
            <Text style={styles.description}>
              {weather.weather[0].description}
            </Text>
          </View>

          <View style={styles.forecastContainer}>
            <Text style={styles.forecastTitle}>Upcoming Forecast</Text>

            {weather.forecast?.map((day, index) => (
              <View key={index} style={styles.forecastRow}>
                <Text style={styles.forecastDay}>
                  {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </Text>

                <Text style={styles.forecastDesc}>
                  {day.weather[0].description}
                </Text>

                <Text style={styles.forecastTemp}>
                  {Math.round(day.main.temp)}°F
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.aiCard}>
            <Text style={styles.aiTitle}>AI Outfit Suggestions</Text>

            {aiLoading ? (
              <Text style={styles.aiText}>Thinking...</Text>
            ) : (
              <Text style={styles.aiText}>
                {aiSuggestion || "No AI suggestion yet."}
              </Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#59C1BD",
    padding: 30,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
  },
  searchCard: {
    backgroundColor: "#EEF1DA",
    margin: 20,
    padding: 20,
    borderRadius: 20,
  },
  searchLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0D4C92",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#D9E2EC",
  },
  button: {
    backgroundColor: "#59C1BD",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  weatherCard: {
    backgroundColor: "#EEF1DA",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  cityName: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#0D4C92",
  },
  temperature: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#0D4C92",
    marginVertical: 10,
  },
  description: {
    fontSize: 15,
    color: "#5c6398",
    textTransform: "capitalize",
  },
  forecastContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#F7F9FC",
    borderRadius: 20,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0D4C92",
    marginBottom: 15,
  },
  forecastRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D4C92",
    width: 50,
  },
  forecastDesc: {
    flex: 1,
    fontSize: 14,
    color: "#5c6398",
    textTransform: "capitalize",
    textAlign: "center",
    marginHorizontal: 8,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D4C92",
    width: 50,
    textAlign: "right",
  },
  aiCard: {
    backgroundColor: "#EEF1DA",
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 20,
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0D4C92",
    marginBottom: 12,
  },
  aiText: {
    fontSize: 15,
    color: "#4A5568",
    lineHeight: 22,
  },
});