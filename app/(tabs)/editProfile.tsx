import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, dc, storage } from "../../services/firebaseConfig";
import { setCachedUserProfile } from "../../services/profileCache";
import { getUserProfile, updateUserProfile } from "../../src/dataconnect-generated";

const DEFAULT_AVATAR = require("../../assets/images/placeholderImg.png");

export default function EditProfile() {
  const isDark = useColorScheme() === "dark";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const theme = {
    background: isDark ? "#000" : "#F7F8EC",
    text: isDark ? "#FFFFFF" : "#111111",
    input: isDark ? "#1E1E1E" : "#F1F5F9",
    border: isDark ? "#333" : "#E5E7EB",
    button: "#134E96",
    subtext: isDark ? "#C7C7C7" : "#666",
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const { data } = await getUserProfile(dc, { id: user.uid });

      if (data?.user) {
        setProfile(data.user);
        setDisplayName(data.user.displayName || "");
        setBio(data.user.bio || "");
        setLocation(data.user.location || "");
        setImageUri(data.user.profilePictureUrl || null);
      }
    } catch {
      Alert.alert("Error", "Could not load profile.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const uploadImage = async (uri: string) => {
    const blob: Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject();
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const storageRef = ref(storage, `profile/${auth.currentUser?.uid}.jpg`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      setSaving(true);

      let photoUrl = profile?.profilePictureUrl || null;
      if (imageUri && imageUri !== profile?.profilePictureUrl) {
        photoUrl = await uploadImage(imageUri);
      }

      const updated = {
        id: user.uid,
        username: profile?.username || "user",
        email: user.email || "",
        displayName,
        bio,
        location,
        profilePictureUrl: photoUrl,
      };

      await updateUserProfile(dc, updated);
      setCachedUserProfile(updated);

      Alert.alert("Saved!");
      router.back();
    } catch {
      Alert.alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#59C1BD" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView>
        <View style={styles.container}>
          
          <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
            <Image
              source={imageUri ? { uri: imageUri } : DEFAULT_AVATAR}
              style={styles.avatar}
            />
            <View style={styles.editIcon}>
              <Feather name="edit-2" size={16} color="#fff" />
            </View>
          </TouchableOpacity>

          <Text style={[styles.helperText, { color: theme.subtext }]}>
            Tap your photo to change it
          </Text>

          <Text style={[styles.label, { color: theme.text }]}>Display Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
            value={displayName}
            onChangeText={setDisplayName}
          />

          <Text style={[styles.label, { color: theme.text }]}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: theme.input, color: theme.text }]}
            value={bio}
            onChangeText={setBio}
            multiline
          />

          <Text style={[styles.label, { color: theme.text }]}>Location</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
            value={location}
            onChangeText={setLocation}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.button }]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>
              {saving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 20 },

  imageWrapper: { alignSelf: "center", marginBottom: 10 },
  avatar: { width: 110, height: 110, borderRadius: 55 },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 6,
  },

  helperText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
    fontFamily: "Epilogue-Regular",
  },

  label: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 15,
    fontFamily: "Epilogue-Bold",
  },

  input: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: "Epilogue-Regular",
  },

  textArea: { minHeight: 90 },

  button: {
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Epilogue-Bold",
  },
});