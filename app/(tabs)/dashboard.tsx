import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { deletedPostIds } from "../../services/deletedPosts";
import { auth, dc, NO_CACHE } from "../../services/firebaseConfig";
import { pendingCreatedPosts } from "../../services/pendingPosts";
import { cachedUserProfile } from "../../services/profileCache";
import {
  createComment,
  createLike,
  deleteLike,
  getCommentsForPost,
  getLikesForPost,
  getUserProfile,
  listPosts,
} from "../../src/dataconnect-generated";

const DEFAULT_AVATAR = require("../../assets/images/placeholderImg.png");

type Comment = {
  id: string;
  username: string;
  text: string;
  createdAt: string;
};

type FeedPost = {
  id: string;
  content: string;
  imageUrl: string;
  locationTag?: string | null;
  zipCode?: string | null;
  isPublic?: boolean;
  tops?: string[] | null;
  topMaterials?: string[] | null;
  bottoms?: string[] | null;
  bottomMaterials?: string[] | null;
  outerwear?: string[] | null;
  outerwearMaterials?: string[] | null;
  wornAt?: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName?: string | null;
    profilePictureUrl?: string | null;
  };
};

export default function Dashboard() {
  const isDark = useColorScheme() === "dark";
  //posts currently in feed
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");
  const [zipInput, setZipInput] = useState("");
  const [userZip, setUserZip] = useState("");

  // track likes by user
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  //comment pet postId
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentInputVisible, setCommentInputVisible] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const inputRefs = useRef<Record<string, TextInput | null>>({});
  const loadingInteractionsRef = useRef(false);

  const pendingLikedPostsRef = useRef<Record<string, boolean>>({});
  const pendingLikeCountsRef = useRef<Record<string, number>>({});
  const pendingCommentsRef = useRef<Record<string, Comment[]>>({});

  const theme = {
    background: isDark ? "#000000" : "#F7F8EC",
    card: isDark ? "#121212" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#111111",
    subtext: isDark ? "#C7C7C7" : "#666666",
    border: isDark ? "#242424" : "#E5E7EB",
    icon: isDark ? "#FFFFFF" : "#111111",
    input: isDark ? "#1E1E1E" : "#F3F4F6",
  };

  const sortPosts = useCallback(
    (feedPosts: FeedPost[]) => {
      return [...feedPosts].sort((a, b) => {
        const newestFirst =
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        if (!userZip || !/^\d{5}$/.test(userZip)) return newestFirst;

        const userZipNum = parseInt(userZip, 10);
        const aZip = parseInt(a.zipCode || "0", 10);
        const bZip = parseInt(b.zipCode || "0", 10);

        const aHasZip = !!a.zipCode && !isNaN(aZip);
        const bHasZip = !!b.zipCode && !isNaN(bZip);

        if (!aHasZip && !bHasZip) return newestFirst;
        if (!aHasZip) return 1;
        if (!bHasZip) return -1;

        const aDist = Math.abs(aZip - userZipNum);
        const bDist = Math.abs(bZip - userZipNum);

        return aDist !== bDist ? aDist - bDist : newestFirst;
      });
    },
    [userZip]
  );

  const detectZip = async () => {
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

      if (geo?.postalCode) {
        setZipInput(geo.postalCode);
        setUserZip(geo.postalCode);
      }
    } catch (error) {
      console.error("Zip detect error:", error);
    }
  };

  const applyZipFilter = () => {
    const cleanZip = zipInput.trim();

    if (cleanZip && !/^\d{5}$/.test(cleanZip)) {
      Alert.alert("Invalid ZIP", "Please enter a 5-digit ZIP code.");
      return;
    }

    setUserZip(cleanZip);
  };

  const loadCurrentUserProfile = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const { data } = await getUserProfile(dc, { id: user.uid }, NO_CACHE);
      const profile = data?.user;

      setCurrentUsername(profile?.username || profile?.displayName || "");
    } catch (error) {
      console.error("Error loading current user profile:", error);
    }
  }, []);

  const loadPostInteractions = useCallback(
    async (postIds: string[], force = false) => {
      const currentUser = auth.currentUser;

      if (!postIds.length) return;
      if (loadingInteractionsRef.current && !force) return;

      loadingInteractionsRef.current = true;

      const nextLiked: Record<string, boolean> = {};
      const nextCounts: Record<string, number> = {};
      const nextComments: Record<string, Comment[]> = {};

      try {
        for (const postId of postIds) {
          const likesResult = await getLikesForPost(
            dc,
            { postId: postId as any },
            NO_CACHE
          );

          const commentsResult = await getCommentsForPost(
            dc,
            { postId: postId as any },
            NO_CACHE
          );

          const likes = likesResult.data?.likes ?? [];
          const postComments = commentsResult.data?.comments ?? [];

          const savedComments: Comment[] = postComments.map((comment) => ({
            id: comment.id,
            username:
              comment.user?.displayName ||
              comment.user?.username ||
              comment.user?.id ||
              "User",
            text: comment.content,
            createdAt: comment.createdAt ?? "",
          }));

          const pendingComments = pendingCommentsRef.current[postId] ?? [];

          nextComments[postId] = [
            ...savedComments,
            ...pendingComments.filter(
              (pending) =>
                !savedComments.some(
                  (saved) =>
                    saved.text === pending.text &&
                    saved.username === pending.username
                )
            ),
          ];

          const backendLiked =
            !!currentUser &&
            likes.some(
              (like: any) =>
                like._id?.userId === currentUser.uid ||
                like.user?.id === currentUser.uid
            );

          nextLiked[postId] =
            pendingLikedPostsRef.current[postId] !== undefined
              ? pendingLikedPostsRef.current[postId]
              : backendLiked;

          nextCounts[postId] =
            pendingLikeCountsRef.current[postId] !== undefined
              ? pendingLikeCountsRef.current[postId]
              : likes.length;

          if (
            pendingLikedPostsRef.current[postId] !== undefined &&
            backendLiked === pendingLikedPostsRef.current[postId]
          ) {
            delete pendingLikedPostsRef.current[postId];
            delete pendingLikeCountsRef.current[postId];
          }

          if (pendingComments.length > 0) {
            const pendingStillMissing = pendingComments.filter(
              (pending) =>
                !savedComments.some(
                  (saved) =>
                    saved.text === pending.text &&
                    saved.username === pending.username
                )
            );

            if (pendingStillMissing.length === 0) {
              delete pendingCommentsRef.current[postId];
            } else {
              pendingCommentsRef.current[postId] = pendingStillMissing;
            }
          }
        }

        setLikedPosts((prev) => ({ ...prev, ...nextLiked }));
        setLikeCounts((prev) => ({ ...prev, ...nextCounts }));
        setComments((prev) => ({ ...prev, ...nextComments }));
      } catch (error) {
        console.error("Error loading post interactions:", error);
      } finally {
        loadingInteractionsRef.current = false;
      }
    },
    []
  );

  const fetchPosts = useCallback(async () => {
  try {
    const { data } = await listPosts(dc, NO_CACHE);

    const backendPosts = ((data?.posts ?? []) as FeedPost[]).filter(
      (post) => !(deletedPostIds?.has(post.id))
    );

    const pendingPosts = Array.from(pendingCreatedPosts.values()).filter(
      (post: FeedPost) => post.isPublic && !(deletedPostIds?.has(post.id))
    );

    const mergedPosts = [
      ...pendingPosts.filter(
        (pending: FeedPost) =>
          !backendPosts.some((post) => post.id === pending.id)
      ),
      ...backendPosts,
    ];

    const feedPosts = sortPosts(mergedPosts);

    setPosts(feedPosts);

    if (feedPosts.length > 0) {
      await loadPostInteractions(
        feedPosts.map((post) => post.id),
        true
      );
    }
  } catch (error) {
    console.error("Error loading posts:", error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, [sortPosts, loadPostInteractions]);

  useEffect(() => {
    detectZip();
  }, []);

  useEffect(() => {
    (async () => {
      await loadCurrentUserProfile();
      await fetchPosts();
    })();
  }, [loadCurrentUserProfile, fetchPosts]);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  useEffect(() => {
    setPosts((prev) => sortPosts(prev));
  }, [userZip, sortPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCurrentUserProfile();
    await fetchPosts();
  };

  const handleLike = async (postId: string) => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Not signed in", "Please sign in to like posts.");
      return;
    }

    const wasLiked = likedPosts[postId] ?? false;
    const nextLiked = !wasLiked;
    const nextCount = Math.max(
      0,
      (likeCounts[postId] ?? 0) + (wasLiked ? -1 : 1)
    );

    pendingLikedPostsRef.current[postId] = nextLiked;
    pendingLikeCountsRef.current[postId] = nextCount;

    // update UI before backend updates
    setLikedPosts((prev) => ({ ...prev, [postId]: nextLiked }));
    setLikeCounts((prev) => ({ ...prev, [postId]: nextCount }));

    try {
      if (wasLiked) {
        await deleteLike(dc, { postId: postId as any, userId: user.uid });
      } else {
        await createLike(dc, { postId: postId as any, userId: user.uid });
      }
    } catch (error: any) {
      const isDuplicate =
        error?.message?.includes("ALREADY_EXISTS") ||
        error?.message?.includes("unique constraint");

      if (isDuplicate) {
        pendingLikedPostsRef.current[postId] = true;
        pendingLikeCountsRef.current[postId] = Math.max(
          likeCounts[postId] ?? 1,
          1
        );

        setLikedPosts((prev) => ({ ...prev, [postId]: true }));
        setLikeCounts((prev) => ({
          ...prev,
          [postId]: Math.max(prev[postId] ?? 1, 1),
        }));
        return;
      }

      console.error("Like error:", error?.message);

      delete pendingLikedPostsRef.current[postId];
      delete pendingLikeCountsRef.current[postId];

      setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: Math.max(0, (prev[postId] ?? 0) + (wasLiked ? 1 : -1)),
      }));
    }
  };

  const handleCommentToggle = (postId: string) => {
    const isVisible = commentInputVisible[postId] ?? false;

    setCommentInputVisible((prev) => ({
      ...prev,
      [postId]: !isVisible,
    }));

    if (!isVisible) {
      setTimeout(() => inputRefs.current[postId]?.focus(), 100);
    }
  };

  const handlePostComment = async (postId: string) => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Not signed in", "Please sign in to comment.");
      return;
    }

    const text = (commentText[postId] ?? "").trim();
    if (!text) return;

    const tempComment: Comment = {
      id: `temp-${Date.now()}`,
      username:
        currentUsername || user.displayName || user.email?.split("@")[0] || "You",
      text,
      createdAt: new Date().toISOString(),
    };

    pendingCommentsRef.current[postId] = [
      ...(pendingCommentsRef.current[postId] ?? []),
      tempComment,
    ];

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] ?? []), tempComment],
    }));

    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    setCommentInputVisible((prev) => ({ ...prev, [postId]: false }));

    try {
      await createComment(dc, {
        postId: postId as any,
        userId: user.uid,
        content: text,
      });
    } catch (error: any) {
      console.error("Comment error:", error?.message);

      pendingCommentsRef.current[postId] = (
        pendingCommentsRef.current[postId] ?? []
      ).filter((comment) => comment.id !== tempComment.id);

      setComments((prev) => ({
        ...prev,
        [postId]: (prev[postId] ?? []).filter(
          (comment) => comment.id !== tempComment.id
        ),
      }));
    }
  };

  const sendTestNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "How was your outfit today?",
        body: "Tap to rate if it kept you comfortable.",
        data: { type: "outfit_feedback" },
        sound: true,
      },
      trigger: { type: "timeInterval", seconds: 5, repeats: false } as any,
    });

    Alert.alert("Sent!", "Background the app — notification fires in 5 seconds.");
  };

  const formatLocation = (post: FeedPost) =>
    post.locationTag || post.zipCode || "Unknown location";

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";

    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "";
    }
  };

  const renderClothingDetail = (
    label: string,
    items?: string[] | null,
    materials?: string[] | null
  ) => {
    if (!items?.length) return null;

    return (
      <Text style={[styles.detailText, { color: theme.text }]}>
        <Text style={styles.detailLabel}>{label}: </Text>
        {materials?.length
          ? `${materials.join(", ")} ${items.join(", ")}`
          : items.join(", ")}
      </Text>
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
        edges={["top"]}
      >
        <ActivityIndicator size="large" color="#59C1BD" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.screenTitle, { color: theme.text }]}>
            Community Feed
          </Text>

          <View
            style={[
              styles.zipFilterCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.zipFilterLabel, { color: theme.text }]}>
              Sort feed by ZIP distance
            </Text>

            <View style={styles.zipFilterRow}>
              <TextInput
                style={[
                  styles.zipInput,
                  {
                    backgroundColor: theme.input,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Enter ZIP code"
                placeholderTextColor={theme.subtext}
                value={zipInput}
                onChangeText={setZipInput}
                keyboardType="number-pad"
                maxLength={5}
              />

              <Pressable onPress={applyZipFilter} style={styles.iconButton}>
                <Ionicons name="search" size={18} color={theme.icon} />
              </Pressable>

              <Pressable onPress={detectZip} style={styles.iconButton}>
                <Ionicons name="location-outline" size={18} color={theme.icon} />
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.testButton} onPress={sendTestNotification}>
            <Text style={styles.testButtonText}>Test Outfit Notification</Text>
          </Pressable>

          {posts.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No posts yet
              </Text>
              <Text style={[styles.emptyText, { color: theme.subtext }]}>
                No posts yet, time to get creative!
              </Text>
            </View>
          ) : (
            posts.map((post) => {
              const liked = likedPosts[post.id] ?? false;
              const likeCount = likeCounts[post.id] ?? 0;
              const postComments = comments[post.id] ?? [];
              const commentCount = postComments.length;
              const isCommentOpen = commentInputVisible[post.id] ?? false;

              return (
                <View
                  key={post.id}
                  style={[
                    styles.postCard,
                    { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                >
                  <View style={styles.postHeader}>
                    <Image
                      source={
                        post.user.profilePictureUrl
                          ? { uri: post.user.profilePictureUrl }
                          : cachedUserProfile?.id === post.user.id &&
                            cachedUserProfile.profilePictureUrl
                          ? { uri: cachedUserProfile.profilePictureUrl }
                          : DEFAULT_AVATAR
                      }
                      style={styles.avatar}
                    />

                    <View style={styles.headerTextContainer}>
                      <Text style={[styles.username, { color: theme.text }]}>
                        {post.user.username}
                      </Text>

                      <View style={styles.locationRow}>
                        <Ionicons
                          name="location-outline"
                          size={14}
                          color={theme.subtext}
                          style={{ marginRight: 4 }}
                        />

                        <Text
                          style={[
                            styles.locationText,
                            { color: theme.subtext },
                          ]}
                        >
                          {formatLocation(post)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Image source={{ uri: post.imageUrl }} style={styles.postImage} />

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleLike(post.id)}
                    >
                      <Ionicons
                        name={liked ? "heart" : "heart-outline"}
                        size={28}
                        color={liked ? "#f43f5e" : theme.icon}
                        style={styles.actionIcon}
                      />

                      <Text
                        style={[
                          styles.actionCount,
                          { color: liked ? "#f43f5e" : theme.subtext },
                        ]}
                      >
                        {likeCount}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleCommentToggle(post.id)}
                    >
                      <Ionicons
                        name={isCommentOpen ? "chatbubble" : "chatbubble-outline"}
                        size={26}
                        color={isCommentOpen ? "#59C1BD" : theme.icon}
                        style={styles.actionIcon}
                      />

                      <Text
                        style={[
                          styles.actionCount,
                          { color: isCommentOpen ? "#59C1BD" : theme.subtext },
                        ]}
                      >
                        {commentCount}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.postStatsRow}>
                    <Text style={[styles.postStatsText, { color: theme.subtext }]}>
                      {likeCount} like{likeCount === 1 ? "" : "s"} ·{" "}
                      {commentCount} comment{commentCount === 1 ? "" : "s"}
                    </Text>
                  </View>

                  <View style={styles.postBody}>
                    <Text style={[styles.captionUsername, { color: theme.text }]}>
                      {post.user.username}{" "}
                      <Text style={[styles.captionText, { color: theme.text }]}>
                        {post.content}
                      </Text>
                    </Text>

                    {renderClothingDetail("top", post.tops, post.topMaterials)}
                    {renderClothingDetail("bottom", post.bottoms, post.bottomMaterials)}
                    {renderClothingDetail(
                      "outerwear",
                      post.outerwear,
                      post.outerwearMaterials
                    )}

                    <Text style={[styles.dateText, { color: theme.subtext }]}>
                      {formatDate(post.wornAt || post.createdAt)}
                    </Text>
                  </View>

                  {postComments.length > 0 && (
                    <View
                      style={[
                        styles.commentsSection,
                        { borderTopColor: theme.border },
                      ]}
                    >
                      {postComments.map((comment) => (
                        <View key={comment.id} style={styles.commentRow}>
                          <Text
                            style={[
                              styles.commentUsername,
                              { color: theme.text },
                            ]}
                          >
                            {comment.username}{" "}
                            <Text
                              style={[
                                styles.commentText,
                                { color: theme.text },
                              ]}
                            >
                              {comment.text}
                            </Text>
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {isCommentOpen && (
                    <View
                      style={[
                        styles.commentInputRow,
                        {
                          borderTopColor: theme.border,
                          backgroundColor: theme.input,
                        },
                      ]}
                    >
                      <TextInput
                        ref={(ref) => {
                          inputRefs.current[post.id] = ref;
                        }}
                        style={[styles.commentInput, { color: theme.text }]}
                        placeholder="Add a comment..."
                        placeholderTextColor={theme.subtext}
                        value={commentText[post.id] ?? ""}
                        onChangeText={(text) =>
                          setCommentText((prev) => ({
                            ...prev,
                            [post.id]: text,
                          }))
                        }
                        onSubmitEditing={() => handlePostComment(post.id)}
                        returnKeyType="send"
                        multiline={false}
                      />

                      <TouchableOpacity
                        onPress={() => handlePostComment(post.id)}
                        disabled={!(commentText[post.id] ?? "").trim()}
                      >
                        <Ionicons
                          name="send"
                          size={22}
                          color={
                            (commentText[post.id] ?? "").trim()
                              ? "#59C1BD"
                              : theme.subtext
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 28,
    paddingHorizontal: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  zipFilterCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  zipFilterLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  zipFilterRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  zipInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  iconButton: {
  padding: 10,
  justifyContent: "center",
  alignItems: "center",
  },
  testButton: {
    backgroundColor: "#59C1BD",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  testButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
  },
  postCard: {
    borderWidth: 1,
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 18,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 3,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
  },
  postImage: {
    width: "100%",
    height: 420,
    resizeMode: "cover",
    backgroundColor: "#DDD",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionIcon: {
    marginRight: 4,
  },
  actionCount: {
    fontSize: 14,
    fontWeight: "600",
  },
  postStatsRow: {
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  postStatsText: {
    fontSize: 13,
    lineHeight: 18,
  },
  postBody: {
    paddingHorizontal: 14,
    paddingBottom: 16,
  },
  captionUsername: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  captionText: {
    fontWeight: "400",
  },
  detailText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 2,
  },
  detailLabel: {
    fontWeight: "700",
  },
  dateText: {
    marginTop: 10,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  commentsSection: {
    borderTopWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 8,
  },
  commentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  commentText: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
  },
});