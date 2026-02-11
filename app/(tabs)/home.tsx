import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to FitCast</Text>
        <Text style={styles.headerSubtitle}>Dress sensibly for every kind of weather!</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});