import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

// to include Forecast data
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

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
      const city = 'College Station';

      // Call Current Weather
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
      );
      const currentData = await currentRes.json();

      // Call 5-Day Forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`
      );
      const forecastData = await forecastRes.json();

      // API gives data every 3 hours. 
      // One entry per day.
      const dailyForecast = forecastData.list.filter((reading: any) =>
        reading.dt_txt.includes("12:00:00")
      );

      setWeather({ ...currentData, forecast: dailyForecast });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#59C1BD" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to FitCast</Text>
        <Text style={styles.headerSubtitle}>Dress sensibly for every kind of weather!</Text>
      </View>

      {weather && (
        <>
          {/* Current Weather Card */}
          <View style={styles.weatherCard}>
            <Text style={styles.cityName}>{weather.name}</Text>
            <Text style={styles.temperature}>{Math.round(weather.main.temp)}°F</Text>
            <Text style={styles.description}>{weather.weather[0].description}</Text>
          </View>

          {/* Forecast Card */}
          <View style={styles.forecastContainer}>
            <Text style={styles.forecastTitle}>Upcoming Forecast</Text>
            {weather.forecast?.map((day, index) => (
              <View key={index} style={styles.forecastRow}>
                <Text style={styles.forecastDay}>
                  {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
                <Text style={styles.forecastDesc}>{day.weather[0].description}</Text>
                <Text style={styles.forecastTemp}>{Math.round(day.main.temp)}°F</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#59C1BD',
    padding: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
  },
  weatherCard: {
    backgroundColor: '#EEF1DA',
    margin: 20,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  cityName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#0D4C92',
  },
  temperature: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#0D4C92',
    marginVertical: 10,
  },
  description: {
    fontSize: 15,
    color: '#5c6398',
    textTransform: 'capitalize',
  },
  // Forecast styles
  forecastContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#F7F9FC',
    borderRadius: 20,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D4C92',
    marginBottom: 15,
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D4C92',
    width: 50,
  },
  forecastDesc: {
    flex: 1,
    fontSize: 14,
    color: '#5c6398',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D4C92',
    width: 50,
    textAlign: 'right',
  },
});