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