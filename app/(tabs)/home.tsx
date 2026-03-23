import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
  const [loading, setLoading] = useState(false);
  const [locationInput, setLocationInput] = useState('');

  const fetchWeather = async () => {
    const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

    if (!API_KEY) {
      Alert.alert('Missing API key', 'Make sure EXPO_PUBLIC_WEATHER_API_KEY is set in your .env file.');
      return;
    }

    if (!locationInput.trim()) {
      Alert.alert('Missing location', 'Please enter a city name or ZIP code.');
      return;
    }

    setLoading(true);

    try {
      const input = locationInput.trim();
      let lat: number;
      let lon: number;
      let resolvedName = '';

      // Check if input is a US ZIP code
      const isZip = /^\d{5}$/.test(input);

      if (isZip) {
        // ZIP geocoding
        const zipRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/zip?zip=${input},US&appid=${API_KEY}`
        );
        const zipData = await zipRes.json();

        if (!zipRes.ok) {
          throw new Error(zipData.message || 'Could not find that ZIP code.');
        }

        lat = zipData.lat;
        lon = zipData.lon;
        resolvedName = zipData.name;
      } else {
        // City geocoding
        const geoRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(input)}&limit=1&appid=${API_KEY}`
        );
        const geoData = await geoRes.json();

        if (!geoRes.ok || !geoData.length) {
          throw new Error('Could not find that city.');
        }

        lat = geoData[0].lat;
        lon = geoData[0].lon;
        resolvedName = geoData[0].name;
      }

      // Current weather by coordinates
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
      );
      const currentData = await currentRes.json();

      if (!currentRes.ok) {
        throw new Error(currentData.message || 'Failed to fetch current weather.');
      }

      // Forecast by coordinates
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
      );
      const forecastData = await forecastRes.json();

      if (!forecastRes.ok) {
        throw new Error(forecastData.message || 'Failed to fetch forecast.');
      }

      const dailyForecast = forecastData.list.filter((reading: ForecastDay) =>
        reading.dt_txt.includes('12:00:00')
      );

      setWeather({
        ...currentData,
        name: resolvedName || currentData.name,
        forecast: dailyForecast,
      });
    } catch (error: any) {
      console.error('Error fetching weather:', error);
      Alert.alert('Error', error.message || 'Something went wrong while fetching weather.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to FitCast</Text>
        <Text style={styles.headerSubtitle}>Dress sensibly for every kind of weather!</Text>
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
        <TouchableOpacity style={styles.button} onPress={fetchWeather} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Get Forecast'}</Text>
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
            <Text style={styles.temperature}>{Math.round(weather.main.temp)}°F</Text>
            <Text style={styles.description}>{weather.weather[0].description}</Text>
          </View>

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
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  searchCard: {
    backgroundColor: '#EEF1DA',
    margin: 20,
    padding: 20,
    borderRadius: 20,
  },
  searchLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D4C92',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D9E2EC',
  },
  button: {
    backgroundColor: '#59C1BD',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  weatherCard: {
    backgroundColor: '#EEF1DA',
    marginHorizontal: 20,
    marginBottom: 20,
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
    marginHorizontal: 8,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D4C92',
    width: 50,
    textAlign: 'right',
  },
});