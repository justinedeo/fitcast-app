import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { deletedPostIds } from "../../services/deletedPosts";
import { auth, dc, NO_CACHE } from "../../services/firebaseConfig";
import { pendingCreatedPosts } from "../../services/pendingPosts";
import { cachedUserProfile } from "../../services/profileCache";
import {
  deletePost,
  getUserPosts,
  getUserProfile,
} from "../../src/dataconnect-generated";

const DEFAULT_AVATAR = require("../../assets/images/placeholderImg.png");

type UserPost = {
  id: string;
  imageUrl: string;
  isPublic?: boolean;
};

export default function ProfilePage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [loading, setLoading] = useState(true);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<UserPost | null>(null);

  const theme = {
    background: isDark ? "#000" : "#59C1BD",
    card: isDark ? "#121212" : "#59C1BD",
    text: "#FFFFFF",
    subtext: isDark ? "#D1D5DB" : "#F7F8EC",
    buttonPrimary: "#134E96",
    buttonSecondary: "#8C88A8",
    gridBg: isDark ? "#000" : "#FFFFFF",
    border: isDark ? "#1F2937" : "#E5E7EB",
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) return;

      const [{ data: profileData }, { data: postsData }] = await Promise.all([
        getUserProfile(dc, { id: user.uid }, NO_CACHE),
        getUserPosts(dc, { userId: user.uid }, NO_CACHE),
      ]);

      if (cachedUserProfile?.id === user.uid) {
        setProfile(cachedUserProfile);
      } else if (profileData?.user) {
        setProfile({ ...profileData.user, email: user.email || "" });
      }

      const backendPosts =
        postsData?.posts
          ?.filter(
            (post: any) => post.imageUrl && !(deletedPostIds?.has(post.id))
          )
          .map((post: any) => ({
            id: post.id,
            imageUrl: post.imageUrl,
            isPublic: post.isPublic,
          })) ?? [];

      const pendingPosts = Array.from(pendingCreatedPosts.values())
        .filter(
          (post: any) =>
            post.user?.id === user.uid &&
            post.imageUrl &&
            !(deletedPostIds?.has(post.id))
        )
        .map((post: any) => ({
          id: post.id,
          imageUrl: post.imageUrl,
          isPublic: post.isPublic,
        }));

      const myPosts = [
        ...pendingPosts.filter(
          (pending) => !backendPosts.some((post) => post.id === pending.id)
        ),
        ...backendPosts,
      ];

      setPosts(myPosts);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      Alert.alert("Error", "Could not sign out.");
    }
  };

  const handleDeletePost = (postId: string) => {
    if (deletingPostId) return;

    Alert.alert("Delete post?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setDeletingPostId(postId);

            await deletePost(dc, { id: postId as any });

            deletedPostIds.add(postId);
            pendingCreatedPosts.delete(postId);

            setSelectedPost(null);
            setPosts((prev) => prev.filter((post) => post.id !== postId));
          } catch (error) {
            console.error("Delete post error:", error);
            Alert.alert("Error", "Could not delete post.");
          } finally {
            setDeletingPostId(null);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  const postCount = posts.length;

  return (
    <>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={{
          backgroundColor: theme.gridBg,
          paddingBottom: 24,
        }}
        ListHeaderComponent={
          <View style={[styles.headerSection, { backgroundColor: theme.card }]}>
            <Image
              source={
                profile?.profilePictureUrl
                  ? { uri: profile.profilePictureUrl }
                  : DEFAULT_AVATAR
              }
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
                <Text style={[styles.statNumber, { color: theme.text }]}>
                  {postCount}
                </Text>
                <Text style={[styles.statLabel, { color: theme.subtext }]}>
                  POSTS
                </Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <Pressable
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.buttonPrimary },
                ]}
                onPress={() => router.push("/(tabs)/editProfile")}
              >
                <Text style={styles.actionButtonText}>Edit Profile</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.buttonSecondary },
                ]}
                onPress={handleSignOut}
              >
                <Text style={styles.actionButtonText}>Sign Out</Text>
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={[styles.gridItem, { borderColor: theme.border }]}
            onPress={() => setSelectedPost(item)}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />

            {item.isPublic === false && (
              <View style={styles.privateBadge}>
                <Ionicons name="lock-closed" size={12} color="#fff" />
              </View>
            )}

            <Pressable
              style={styles.deleteBadge}
              onPress={() => handleDeletePost(item.id)}
              disabled={deletingPostId === item.id}
            >
              <Text style={styles.deleteBadgeText}>
                {deletingPostId === item.id ? "..." : "Delete"}
              </Text>
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet.</Text>
          </View>
        }
      />

      <Modal
        visible={!!selectedPost}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPost(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelectedPost(null)}
        >
          {selectedPost && (
            <Image
              source={{ uri: selectedPost.imageUrl }}
              style={styles.fullImage}
            />
          )}
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerSection: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  avatar: { width: 95, height: 95, borderRadius: 47.5, marginBottom: 14 },
  displayName: { fontSize: 30, fontWeight: "600", marginBottom: 4 },
  subInfo: { fontSize: 14, marginBottom: 18, textAlign: "center" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 22,
  },
  statBlock: { alignItems: "center", minWidth: 80 },
  statNumber: { fontSize: 24, fontWeight: "700" },
  statLabel: { fontSize: 12, marginTop: 2 },
  buttonRow: { flexDirection: "row", gap: 12, marginTop: 4 },
  actionButton: {
    minWidth: 140,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  actionButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  gridItem: { width: "33.3333%", aspectRatio: 1, borderWidth: 0.5 },
  gridImage: { width: "100%", height: "100%" },
  deleteBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(220,38,38,0.9)",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  deleteBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  privateBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    padding: 4,
  },
  emptyContainer: { paddingVertical: 30, alignItems: "center" },
  emptyText: { fontSize: 16, color: "#666" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "92%",
    height: "70%",
    resizeMode: "contain",
    borderRadius: 12,
  },
});