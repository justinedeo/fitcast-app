import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { dc, NO_CACHE } from "../services/firebaseConfig";
import { getUserPosts, getUserProfile } from "../src/dataconnect-generated";

type UserPost = {
  id: string;
  imageUrl: string;
  isPublic?: boolean;
};

export default function UserProfilePage() {
  const { userId } = useLocalSearchParams();
  const isDark = useColorScheme() === "dark";

  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<UserPost | null>(null);
  const [loading, setLoading] = useState(true);

  const theme = {
    background: isDark ? "#000" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#111111",
    subtext: isDark ? "#D1D5DB" : "#555555",
    border: isDark ? "#1F2937" : "#E5E7EB",
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = userId as string;

        const [{ data: profileData }, { data: postsData }] = await Promise.all([
          getUserProfile(dc, { id }, NO_CACHE),
          getUserPosts(dc, { userId: id }, NO_CACHE),
        ]);

        setUser(profileData?.user);

        const visiblePosts =
          postsData?.posts
            ?.filter((post: any) => post.imageUrl && post.isPublic !== false)
            .map((post: any) => ({
              id: post.id,
              imageUrl: post.imageUrl,
              isPublic: post.isPublic,
            })) ?? [];

        setPosts(visiblePosts);
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>User not found</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={{ backgroundColor: theme.background, paddingBottom: 24 }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Image
              source={{
                uri:
                  user.profilePictureUrl ||
                  "https://via.placeholder.com/150x150.png?text=User",
              }}
              style={styles.avatar}
            />

            <Text style={[styles.name, { color: theme.text }]}>
              {user.displayName || user.username}
            </Text>

            <Text style={[styles.username, { color: theme.subtext }]}>
              @{user.username}
            </Text>

            {user.bio && (
              <Text style={[styles.bio, { color: theme.subtext }]}>
                {user.bio}
              </Text>
            )}

            {user.location && (
              <Text style={[styles.location, { color: theme.subtext }]}>
                {user.location}
              </Text>
            )}

            <Text style={[styles.postCount, { color: theme.subtext }]}>
              {posts.length} POSTS
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={[styles.gridItem, { borderColor: theme.border }]}
            onPress={() => setSelectedPost(item)}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.subtext }]}>
              No public posts yet.
            </Text>
          </View>
        }
      />

      <Modal
        visible={!!selectedPost}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPost(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedPost(null)}>
          {selectedPost && (
            <Image source={{ uri: selectedPost.imageUrl }} style={styles.fullImage} />
          )}
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
  },
  username: {
    fontSize: 16,
    marginTop: 4,
  },
  bio: {
    marginTop: 12,
    fontSize: 14,
    textAlign: "center",
  },
  location: {
    marginTop: 8,
    fontSize: 14,
  },
  postCount: {
    marginTop: 18,
    fontSize: 12,
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
  },
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