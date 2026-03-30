<<<<<<< HEAD
import { router } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db } from "../../services/firebaseConfig"; // Ensure this path is correct

const ProfilePage = () => {
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<any>(null);

    // Form State
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setProfile(userData);
                    setDisplayName(userData.displayName || "");
                    setBio(userData.bio || "");
                    setLocation(userData.location || "");
                }
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            Alert.alert("Error", "Could not load profile data.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            setLoading(true);

            await updateDoc(doc(db, "users", user.uid), {
                displayName,
                bio,
                location,
            });

            setProfile((prev: any) => ({
                ...prev,
                displayName,
                bio,
                location,
            }));

            setIsEditing(false);
            Alert.alert("Success", "Profile updated!");
        } catch (error) {
            console.error("Update failed:", error);
            Alert.alert("Error", "Could not update profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            router.replace("/(auth)/login");
        } catch (error) {
            Alert.alert("Error", "Failed to sign out.");
        }
    };

    if (loading && !profile) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0D4C92" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Header Section */}
                <View style={styles.header}>
                    <Image
                        source={{ uri: profile?.profilePictureUrl || 'https://via.placeholder.com/150' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.username}>@{profile?.username || 'user'}</Text>
                    <Text style={styles.email}>{profile?.email}</Text>
                </View>

                {/* Info/Edit Section */}
                <View style={styles.card}>
                    <Text style={styles.label}>Display Name</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={displayName}
                            onChangeText={setDisplayName}
                            placeholder="Enter display name"
                        />
                    ) : (
                        <Text style={styles.value}>{profile?.displayName || "Not set"}</Text>
                    )}

                    <Text style={styles.label}>Bio</Text>
                    {isEditing ? (
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Tell us about yourself"
                            multiline
                        />
                    ) : (
                        <Text style={styles.value}>{profile?.bio || "No bio added yet."}</Text>
                    )}

                    <Text style={styles.label}>Location</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={location}
                            onChangeText={setLocation}
                            placeholder="e.g. College Station, TX"
                        />
                    ) : (
                        <Text style={styles.value}>{profile?.location || "Not set"}</Text>
                    )}

                    <TouchableOpacity
                        style={[styles.button, isEditing ? styles.saveButton : styles.editButton]}
                        onPress={isEditing ? handleUpdate : () => setIsEditing(true)}
                    >
                        <Text style={styles.buttonText}>{isEditing ? "Save Changes" : "Edit Profile"}</Text>
                    </TouchableOpacity>

                    {isEditing && (
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
=======
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";
import { auth, dc } from "../../services/firebaseConfig";
import { getUserProfile, listPosts } from "../../src/dataconnect-generated";

type UserPost = {
  id: string;
  imageUrl: string;
>>>>>>> origin/main
};

export default function ProfilePage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);

  const theme = {
    background: isDark ? "#000" : "#59C1BD",
    card: isDark ? "#121212" : "#59C1BD",
    text: isDark ? "#FFFFFF" : "#FFFFFF",
    subtext: isDark ? "#D1D5DB" : "#F7F8EC",
    buttonPrimary: "#134E96",
    buttonSecondary: "#8C88A8",
    gridBg: isDark ? "#000" : "#FFFFFF",
    border: isDark ? "#1F2937" : "#E5E7EB",
  };

  const fetchData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const [{ data: profileData }, { data: postsData }] = await Promise.all([
        getUserProfile(dc, { id: user.uid }),
        listPosts(dc),
      ]);

      if (profileData?.user) {
        setProfile({
          ...profileData.user,
          email: user.email || "",
        });
      }

      const myPosts =
        postsData?.posts
          ?.filter((post) => post.user.id === user.uid && post.imageUrl)
          .map((post) => ({
            id: post.id,
            imageUrl: post.imageUrl,
          })) ?? [];

      setPosts(myPosts);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  const postCount = posts.length;
  const followingCount = 0;
  const followerCount = 0;

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={{ backgroundColor: theme.gridBg, paddingBottom: 24 }}
      ListHeaderComponent={
        <View style={[styles.headerSection, { backgroundColor: theme.card }]}>
          <Image
            source={{
              uri:
                profile?.profilePictureUrl ||
                "https://via.placeholder.com/150x150.png?text=User",
            }}
            style={styles.avatar}
          />

          <Text style={[styles.displayName, { color: theme.text }]}>
            {profile?.displayName || profile?.username || "User"}
          </Text>

          <Text style={[styles.subInfo, { color: theme.subtext }]}>
            {profile?.location || "Location not set"}
            {profile?.bio ? ` • ${profile.bio}` : ""}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={[styles.statNumber, { color: theme.text }]}>{postCount}</Text>
              <Text style={[styles.statLabel, { color: theme.subtext }]}>POSTS</Text>
            </View>

            <View style={styles.statBlock}>
              <Text style={[styles.statNumber, { color: theme.text }]}>{followingCount}</Text>
              <Text style={[styles.statLabel, { color: theme.subtext }]}>FOLLOWING</Text>
            </View>

            <View style={styles.statBlock}>
              <Text style={[styles.statNumber, { color: theme.text }]}>{followerCount}</Text>
              <Text style={[styles.statLabel, { color: theme.subtext }]}>FOLLOWERS</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.actionButton, { backgroundColor: theme.buttonPrimary }]}
              onPress={() => router.push("/(tabs)/editProfile")}
            >
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </Pressable>

            <Pressable
              style={[styles.actionButton, { backgroundColor: theme.buttonSecondary }]}
              onPress={() => {}}
            >
              <Text style={styles.actionButtonText}>Share</Text>
            </Pressable>
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <View style={[styles.gridItem, { borderColor: theme.border }]}>
          <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No posts yet.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSection: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 95,
    height: 95,
    borderRadius: 47.5,
    marginBottom: 14,
  },
  displayName: {
    fontSize: 30,
    fontWeight: "600",
    marginBottom: 4,
  },
  subInfo: {
    fontSize: 14,
    marginBottom: 18,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 22,
  },
  statBlock: {
    alignItems: "center",
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    minWidth: 140,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  gridItem: {
    width: "33.3333%",
    aspectRatio: 1,
    borderWidth: 0.5,
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});