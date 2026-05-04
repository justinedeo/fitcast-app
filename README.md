# FitCast

## Course
CSCI 440-Capstone Final

## Team
Justine  
Gabe  
Caitlyn  
Ian  

---

## Overview

FitCast is a mobile application that combines real-time weather data, social outfit sharing, and AI-powered recommendations to help users decide what to wear. Users can post outfits, explore other users, and receive personalized suggestions based on weather conditions and past feedback.

---

## Setup Instructions

### 1. Clone the Repository (final-tests branch)
git clone -b final-tests https://github.com/justinedeo/fitcast-app.git  
cd fitcast-app  

## DO NOT CLONE MAIN

---

### 2. Install Dependencies
npm install  

npx expo install @expo/vector-icons  
npx expo install expo-image-picker  
npx expo install expo-notifications  
npx expo install expo-router  
npx expo install react-native-safe-area-context  
npx expo install expo-location  

---

### 3. Add Configuration Files

Drag `firebaseConfig.ts` into:
services/firebaseConfig.ts  

Drag `.env` into the root of the project:
.env  

The `.env` file should contain:
EXPO_PUBLIC_WEATHER_API_KEY=your_openweather_api_key  
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

---

### 4. Run the App
npx expo start -c  

If using Codespaces or experiencing connection issues:
npx expo start -c --tunnel  

---

## Notes

Firebase configuration is not included in the repository for security reasons, please request ignored files from Justine  
Data Connect generated files are already included, no additional setup is required  
Expo Go has limited support for notifications 

Thanks for trying it out and thanks for a great semester Professor Alsmirat!
