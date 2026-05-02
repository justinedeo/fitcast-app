import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { auth, dc, storage } from "../../services/firebaseConfig";
import { createPost } from "../../src/dataconnect-generated";

export default function Post() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [top, setTop] = useState("");
  const [bottom, setBottom] = useState("");
  const [outerwear, setOuterwear] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();



    if (!permission.granted) {
      Alert.alert("Permission required", "Allow photo access to continue.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImageAsync = async (uri: string) => {
    const blob: Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Image request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const filePath = `posts/${auth.currentUser?.uid}/${Date.now()}.jpg`;
    const storageRef = ref(storage, filePath);

    console.log("currentUser uid:", auth.currentUser?.uid);
    console.log("imageUri:", uri);
    console.log("upload path:", filePath);

    await uploadBytes(storageRef, blob);
    (blob as any).close?.();

    return await getDownloadURL(storageRef);
  };

  const resolveZipToLocation = async (zip: string) => {
    const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

    if (!API_KEY) {
      throw new Error("Missing EXPO_PUBLIC_WEATHER_API_KEY.");
    }

    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/zip?zip=${zip},US&appid=${API_KEY}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not find that ZIP code.");
    }

    return {
      zipCode: zip,
      locationTag: data.name ? `${data.name}, US` : zip,
    };
  };

  const handleSubmit = async () => {
    if (!imageUri) {
      Alert.alert("Missing image", "You must select an image.");
      return;
    }

    if (!caption.trim()) {
      Alert.alert("Missing caption", "Please enter a caption.");
      return;
    }

    if (!zipCode.trim()) {
      Alert.alert("Missing ZIP code", "Please enter a ZIP code.");
      return;
    }

    if (!/^\d{5}$/.test(zipCode.trim())) {
      Alert.alert("Invalid ZIP code", "Please enter a valid 5-digit ZIP code.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "User not logged in.");
      return;
    }

    try {
      setSubmitting(true);

      const resolvedLocation = await resolveZipToLocation(zipCode.trim());
      const imageUrl = await uploadImageAsync(imageUri);

      await createPost(dc, {
        userId: user.uid,
        content: caption.trim(),
        imageUrl,
        locationTag: resolvedLocation.locationTag,
        top: top.trim() || null,
        bottom: bottom.trim() || null,
        outerwear: outerwear.trim() || null,
        wornAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Post created!");

      setImageUri(null);
      setCaption("");
      setTop("");
      setBottom("");
      setOuterwear("");
      setZipCode("");
    } catch (error: any) {
      console.error("Create post failed:", error);
      console.error("code:", error?.code);
      console.error("message:", error?.message);
      console.error("serverResponse:", error?.serverResponse);
      Alert.alert("Error", error?.message || "Failed to create post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Post</Text>
        <Text style={styles.headerSubtitle}>Share your look with FitCast</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Photo *</Text>
        <Pressable style={styles.imageBox} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.imageText}>Tap to select an image</Text>
          )}
        </Pressable>

        <Text style={styles.label}>Caption *</Text>
        <TextInput
          style={styles.input}
          placeholder="Write a caption..."
          placeholderTextColor="#8689A0"
          value={caption}
          onChangeText={setCaption}
        />

        <Text style={styles.label}>Top</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex. white baby tee"
          placeholderTextColor="#8689A0"
          value={top}
          onChangeText={setTop}
        />

        <Text style={styles.label}>Bottom</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex. blue jeans"
          placeholderTextColor="#8689A0"
          value={bottom}
          onChangeText={setBottom}
        />

        <Text style={styles.label}>Outerwear</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex. denim jacket"
          placeholderTextColor="#8689A0"
          value={outerwear}
          onChangeText={setOuterwear}
        />

        <Text style={styles.label}>ZIP Code *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex. 77840"
          placeholderTextColor="#8689A0"
          value={zipCode}
          onChangeText={setZipCode}
          keyboardType="number-pad"
          maxLength={5}
        />

        <Pressable
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting ? "Posting..." : "Post"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: "#59C1BD",
    padding: 30,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
  },
  card: {
    backgroundColor: "#EEF1DA",
    margin: 20,
    padding: 20,
    borderRadius: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D4C92",
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#D9E2EC",
    fontSize: 16,
  },
  imageBox: {
    height: 220,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D9E2EC",
  },
  imageText: {
    color: "#8689A0",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: "#134E96",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});