import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { auth, dc } from "../services/firebaseConfig";
import { createOutfitFeedback } from "../src/dataconnect-generated";

type Props = {
  visible: boolean;
  postId: string;
  temperature?: number | null;
  weatherCondition?: string | null;
  onClose: () => void;
};

const RATINGS = [
  { label: "Too Warm", value: "too_warm", color: "#FF6B6B" },
  { label: "Too Cold", value: "too_cold", color: "#74C0FC" },
  { label: "Perfect", value: "perfect",  color: "#59C1BD" },
];

export default function OutfitFeedbackModal({
  visible,
  postId,
  temperature,
  weatherCondition,
  onClose,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleRate = async (rating: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      setSelected(rating);
      setSubmitting(true);

      await createOutfitFeedback(dc, {
        userId: user.uid,
        postId,
        rating,
        temperature: temperature ?? null,
        weatherCondition: weatherCondition ?? null,
      });

      Alert.alert("Thanks!", "Your feedback helps us make better suggestions.");
      onClose();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to save feedback.");
    } finally {
      setSubmitting(false);
      setSelected(null);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.title}>How was your outfit today?</Text>
          <Text style={styles.subtitle}>
            Help FitCast learn your comfort preferences
          </Text>

          <View style={styles.buttonGroup}>
            {RATINGS.map((r) => (
              <Pressable
                key={r.value}
                style={[
                  styles.ratingButton,
                  { borderColor: r.color },
                  selected === r.value && { backgroundColor: r.color },
                ]}
                onPress={() => handleRate(r.value)}
                disabled={submitting}
              >
                {submitting && selected === r.value ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text
                      style={[
                        styles.ratingLabel,
                        { color: selected === r.value ? "#fff" : r.color },
                      ]}
                    >
                      {r.label}
                    </Text>
                  </>
                )}
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.skipButton} onPress={onClose}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DDD",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  buttonGroup: {
    width: "100%",
    gap: 14,
    marginBottom: 20,
  },
  ratingButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 18,
    borderRadius: 18,
    borderWidth: 2,
    backgroundColor: "#fff",
  },
  ratingEmoji: {
    fontSize: 26,
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  skipButton: {
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 15,
    color: "#999",
  },
});