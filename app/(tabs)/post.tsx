import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth, dc, storage } from "../../services/firebaseConfig";
import { pendingCreatedPosts } from "../../services/pendingPosts";
import { createPost } from "../../src/dataconnect-generated";

const TOPS = [
  "T-Shirt","Tank Top","Crop Top","Blouse","Button-Down","Polo","Henley",
  "Sweater","Hoodie","Sweatshirt","Turtleneck","Cardigan","Tube Top","Bodysuit","Cami",
];
const BOTTOMS = [
  "Jeans","Chinos","Trousers","Shorts","Leggings","Skirt","Mini Skirt","Midi Skirt",
  "Maxi Skirt","Sweatpants","Joggers","Cargo Pants","Wide-Leg Pants","Straight-Leg Pants","Biker Shorts",
];
const OUTERWEAR = [
  "Jacket","Blazer","Coat","Trench Coat","Puffer Jacket","Parka","Denim Jacket",
  "Leather Jacket","Windbreaker","Bomber Jacket","Fleece","Vest","Raincoat","Peacoat","Cape",
];
const MATERIALS = [
  "Cotton","Polyester","Linen","Wool","Cashmere","Silk","Satin","Velvet","Denim",
  "Leather","Faux Leather","Suede","Nylon","Spandex/Lycra","Rayon/Viscose","Fleece",
  "Knit","Mesh","Chiffon","Tweed","Corduroy","Terry Cloth","Modal","Bamboo",
];

function TagPicker({
  options, selected, onToggle, color,
}: {
  options: string[];
  selected: string[];
  onToggle: (tag: string) => void;
  color: string;
}) {
  return (
    <View style={styles.tagContainer}>
      {options.map((tag) => {
        const active = selected.includes(tag);
        return (
          <Pressable
            key={tag}
            onPress={() => onToggle(tag)}
            style={[styles.tag, active && { backgroundColor: color, borderColor: color }]}
          >
            <Text style={[styles.tagText, active && styles.tagTextActive]}>{tag}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ClothingSection({
  label, typeOptions, selectedType, onToggleType,
  selectedMaterials, onToggleMaterial, typeColor, materialColor,
}: {
  label: string;
  typeOptions: string[];
  selectedType: string[];
  onToggleType: (t: string) => void;
  selectedMaterials: string[];
  onToggleMaterial: (m: string) => void;
  typeColor: string;
  materialColor: string;
}) {
  return (
    <View style={styles.clothingSection}>
      <Text style={styles.label}>{label}</Text>
      <TagPicker
        options={typeOptions}
        selected={selectedType}
        onToggle={onToggleType}
        color={typeColor}
      />
      {selectedType.length > 0 && (
        <View style={styles.materialBox}>
          <Text style={styles.subLabel}>
            Material{selectedType.length > 1 ? "s" : ""} for {selectedType.join(", ")}
          </Text>
          <TagPicker
            options={MATERIALS}
            selected={selectedMaterials}
            onToggle={onToggleMaterial}
            color={materialColor}
          />
        </View>
      )}
    </View>
  );
}

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

export default function Post() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [tops, setTops] = useState<string[]>([]);
  const [topMaterials, setTopMaterials] = useState<string[]>([]);
  const [bottoms, setBottoms] = useState<string[]>([]);
  const [bottomMaterials, setBottomMaterials] = useState<string[]>([]);
  const [outerwear, setOuterwear] = useState<string[]>([]);
  const [outerwearMaterials, setOuterwearMaterials] = useState<string[]>([]);
  const [zipCode, setZipCode] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [detectingZip, setDetectingZip] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    autoDetectZip();
  }, []);

  const autoDetectZip = async () => {
    setDetectingZip(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const [geo] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geo?.postalCode) setZipCode(geo.postalCode);
    } catch (e) {
      console.error("ZIP auto-detect error:", e);
    } finally {
      setDetectingZip(false);
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
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const uploadImageAsync = async (uri: string) => {
    const blob: Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(new TypeError("Image request failed"));
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    const filePath = `posts/${auth.currentUser?.uid}/${Date.now()}.jpg`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, blob);
    (blob as any).close?.();
    return await getDownloadURL(storageRef);
  };

  const resolveZipToLocation = async (zip: string) => {
    const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
    if (!API_KEY) throw new Error("Missing EXPO_PUBLIC_WEATHER_API_KEY.");
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/zip?zip=${zip},US&appid=${API_KEY}`
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Could not find that ZIP code.");
    return { zipCode: zip, locationTag: data.name ? `${data.name}, US` : zip };
  };

  const handleSubmit = async () => {
  if (!imageUri) return Alert.alert("Missing image", "You must select an image.");
  if (!caption.trim()) return Alert.alert("Missing caption", "Please enter a caption.");
  if (!zipCode.trim()) return Alert.alert("Missing ZIP code", "Please enter a ZIP code.");
  if (!/^\d{5}$/.test(zipCode.trim()))
    return Alert.alert("Invalid ZIP code", "Please enter a valid 5-digit ZIP code.");
  if (tops.length === 0 && bottoms.length === 0 && outerwear.length === 0)
    return Alert.alert("Missing outfit", "Please select at least one clothing item.");
  if (tops.length > 0 && topMaterials.length === 0)
    return Alert.alert("Missing material", "Please select a material for your top.");
  if (bottoms.length > 0 && bottomMaterials.length === 0)
    return Alert.alert("Missing material", "Please select a material for your bottom.");
  if (outerwear.length > 0 && outerwearMaterials.length === 0)
    return Alert.alert("Missing material", "Please select a material for your outerwear.");

  const user = auth.currentUser;
  if (!user) return Alert.alert("Error", "User not logged in.");

  try {
    setSubmitting(true);

    const resolvedLocation = await resolveZipToLocation(zipCode.trim());
    const imageUrl = await uploadImageAsync(imageUri);
    const now = new Date().toISOString();

    const { data: createPostData } = await createPost(dc, {
      userId: user.uid,
      content: caption.trim(),
      imageUrl,
      locationTag: resolvedLocation.locationTag,
      zipCode: resolvedLocation.zipCode,
      tops: tops.length ? tops : null,
      topMaterials: topMaterials.length ? topMaterials : null,
      bottoms: bottoms.length ? bottoms : null,
      bottomMaterials: bottomMaterials.length ? bottomMaterials : null,
      outerwear: outerwear.length ? outerwear : null,
      outerwearMaterials: outerwearMaterials.length ? outerwearMaterials : null,
      wornAt: now,
      isPublic,
    });

    const newPostId = createPostData?.post_insert?.id;

    if (newPostId) {
      pendingCreatedPosts.set(newPostId, {
        id: newPostId,
        content: caption.trim(),
        imageUrl,
        locationTag: resolvedLocation.locationTag,
        zipCode: resolvedLocation.zipCode,
        isPublic,
        tops: tops.length ? tops : null,
        topMaterials: topMaterials.length ? topMaterials : null,
        bottoms: bottoms.length ? bottoms : null,
        bottomMaterials: bottomMaterials.length ? bottomMaterials : null,
        outerwear: outerwear.length ? outerwear : null,
        outerwearMaterials: outerwearMaterials.length ? outerwearMaterials : null,
        wornAt: now,
        createdAt: now,
        user: {
          id: user.uid,
          username: user.email?.split("@")[0] || "user",
          displayName: user.displayName || null,
          profilePictureUrl: user.photoURL || null,
        },
      });
    }

    Alert.alert("Success", "Post created!");
    setImageUri(null);
    setCaption("");
    setTops([]);
    setTopMaterials([]);
    setBottoms([]);
    setBottomMaterials([]);
    setOuterwear([]);
    setOuterwearMaterials([]);
    setZipCode("");
    setIsPublic(true);
    autoDetectZip();
  } catch (error: any) {
    console.error("Create post failed:", error);
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
        {/* Photo */}
        <Text style={styles.label}>Photo *</Text>
        <Pressable style={styles.imageBox} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.imageText}>Tap to select an image</Text>
          )}
        </Pressable>

        {/* Caption */}
        <Text style={styles.label}>Caption *</Text>
        <TextInput
          style={styles.input}
          placeholder="Write a caption..."
          placeholderTextColor="#8689A0"
          value={caption}
          onChangeText={setCaption}
        />

        {/* Clothing */}
        <ClothingSection
          label="Top"
          typeOptions={TOPS}
          selectedType={tops}
          onToggleType={(t) => { setTops(toggle(tops, t)); setTopMaterials([]); }}
          selectedMaterials={topMaterials}
          onToggleMaterial={(m) => setTopMaterials(toggle(topMaterials, m))}
          typeColor="#59C1BD"
          materialColor="#0D4C92"
        />
        <ClothingSection
          label="Bottom"
          typeOptions={BOTTOMS}
          selectedType={bottoms}
          onToggleType={(t) => { setBottoms(toggle(bottoms, t)); setBottomMaterials([]); }}
          selectedMaterials={bottomMaterials}
          onToggleMaterial={(m) => setBottomMaterials(toggle(bottomMaterials, m))}
          typeColor="#59C1BD"
          materialColor="#0D4C92"
        />
        <ClothingSection
          label="Outerwear"
          typeOptions={OUTERWEAR}
          selectedType={outerwear}
          onToggleType={(t) => { setOuterwear(toggle(outerwear, t)); setOuterwearMaterials([]); }}
          selectedMaterials={outerwearMaterials}
          onToggleMaterial={(m) => setOuterwearMaterials(toggle(outerwearMaterials, m))}
          typeColor="#59C1BD"
          materialColor="#0D4C92"
        />

        {/* ZIP Code */}
        <Text style={styles.label}>ZIP Code *</Text>
        <View style={styles.zipRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Ex. 77840"
            placeholderTextColor="#8689A0"
            value={zipCode}
            onChangeText={setZipCode}
            keyboardType="number-pad"
            maxLength={5}
          />
          <Pressable style={styles.detectBtn} onPress={autoDetectZip} disabled={detectingZip}>
            {detectingZip ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.detectBtnText}>Detect</Text>
            )}
          </Pressable>
        </View>

        {/* Privacy Toggle */}
        <View style={styles.privacyRow}>
          <View style={styles.privacyText}>
            <Text style={styles.label}>
              {isPublic ? "Public" : "Private"}
            </Text>
            <Text style={styles.privacySubtext}>
              {isPublic
                ? "Visible to everyone in the community feed"
                : "Only visible on your profile"}
            </Text>
          </View>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: "#C4CDD6", true: "#59C1BD" }}
            thumbColor={isPublic ? "#134E96" : "#fff"}
          />
        </View>

        <Pressable
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>{submitting ? "Posting..." : "Post"}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { paddingBottom: 30 },
  header: { backgroundColor: "#59C1BD", padding: 30, alignItems: "center" },
  headerTitle: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 8,
    fontFamily: "Epilogue-Bold",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Epilogue-Regular",
  },
  card: { backgroundColor: "#EEF1DA", margin: 20, padding: 20, borderRadius: 20 },
  clothingSection: { marginTop: 6 },
  label: {
    fontSize: 16,
    color: "#0D4C92",
    marginTop: 14,
    marginBottom: 8,
    fontFamily: "Epilogue-Bold",
  },
  subLabel: {
    fontSize: 13,
    color: "#59C1BD",
    marginBottom: 8,
    fontFamily: "Epilogue-Bold",
  },
  materialBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#D9E2EC",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#D9E2EC",
    fontSize: 16,
    fontFamily: "Epilogue-Regular",
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
    fontFamily: "Epilogue-Regular",
  },
  image: { width: "100%", height: "100%" },
  tagContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#C4CDD6",
    backgroundColor: "#fff",
  },
  tagText: {
    fontSize: 13,
    color: "#4A5568",
    fontFamily: "Epilogue-Regular",
  },
  tagTextActive: {
    color: "#fff",
    fontFamily: "Epilogue-Bold",
  },
  zipRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  detectBtn: {
    backgroundColor: "#59C1BD",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  detectBtnText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Epilogue-Bold",
  },
  privacyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#D9E2EC",
  },
  privacyText: { flex: 1, marginRight: 12 },
  privacySubtext: {
    fontSize: 12,
    color: "#8689A0",
    marginTop: 2,
    fontFamily: "Epilogue-Regular",
  },
  button: {
    backgroundColor: "#134E96",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Epilogue-Bold",
  },
});