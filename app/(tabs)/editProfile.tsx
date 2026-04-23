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

import { getUserProfile, updateUserProfile } from "../../dataconnect/example/.dataconnect-generated";
import { auth, dc, storage } from "../../services/firebaseConfig";

export default function EditProfile() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const theme = {
    background: isDark ? "#000" : "#F7F8EC",
    card: isDark ? "#121212" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#111111",
    input: isDark ? "#1E1E1E" : "#F1F5F9",
    border: isDark ? "#333333" : "#E5E7EB",
    button: "#134E96",
    subtext: isDark ? "#C7C7C7" : "#666666",
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
        const mergedProfile = {
          ...data.user,
          email: user.email || "",
        };

        setProfile(mergedProfile);
        setDisplayName(data.user.displayName || "");
        setBio(data.user.bio || "");
        setLocation(data.user.location || "");
        setImageUri(data.user.profilePictureUrl || null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Could not load profile.");
    } finally {
      setLoading(false);
    }
  };

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

  const uploadImage = async (uri: string) => {
    const blob: Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(new TypeError("Upload failed"));
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const path = `profile/${auth.currentUser?.uid}.jpg`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, blob);
    (blob as any).close?.();

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

      await updateUserProfile(dc, {
        id: user.uid,
        username: profile?.username || user.email?.split("@")[0] || "user",
        email: user.email || "",
        displayName: displayName || null,
        bio: bio || null,
        location: location || null,
        profilePictureUrl: photoUrl,
      });

      Alert.alert("Saved!", "Your profile has been updated.");
      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: theme.background }]} edges={["top"]}>
        <ActivityIndicator size="large" color="#59C1BD" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <ScrollView style={{ backgroundColor: theme.background }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
            <Image
              source={{
                uri: imageUri || "https://via.placeholder.com/150",
              }}
              style={styles.avatar}
            />
            <View style={styles.editIcon}>
              <Feather name="edit-2" size={16} color="#fff" />
            </View>
          </TouchableOpacity>

          <Text style={[styles.helperText, { color: theme.subtext }]}>
            Tap your photo to change it
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Display Name</Text>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter display name"
              placeholderTextColor={theme.subtext}
              style={[
                styles.input,
                {
                  backgroundColor: theme.input,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Bio</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              placeholderTextColor={theme.subtext}
              multiline
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: theme.input,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Location</Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. College Station, TX"
              placeholderTextColor={theme.subtext}
              style={[
                styles.input,
                {
                  backgroundColor: theme.input,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.button }]}
            onPress={handleSave}
            disabled={saving}
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },
  imageWrapper: {
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
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
    marginBottom: 24,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    fontSize: 15,
  },
  input: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});