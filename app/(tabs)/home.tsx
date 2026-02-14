import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

interface WeatherData{
  name: string;
  main: {
    temp: number;
  };
  weather: Array<{
    description: string;
  }>;
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

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
      );
      const data = await response.json();
      setWeather(data);
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

      {
        weather && (
          <View style={styles.weatherCard}>
            <Text style={styles.cityName}>{weather.name}</Text>
            <Text style={styles.temperature}>{Math.round(weather.main.temp)}°F</Text>
            <Text style={styles.description}>{weather.weather[0].description}</Text>
          </View>
        )
      }
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
    fontFamily: 'Epilogue-Bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Epilogue-Regular',
  },
  // Eventually remove this card
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
    fontFamily: 'Epilogue-Bold',
  },
  temperature: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#0D4C92',
    marginVertical: 10,
    fontFamily: 'Epilogue-Bold',
  },
  description: {
    fontSize: 15,
    color: '#5c6398',
    textTransform: 'capitalize',
    fontFamily: 'Epilogue-Regular',
  },
});