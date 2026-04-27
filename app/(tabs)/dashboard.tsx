import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import {
  createLike,
  deleteLike,
  createComment,
  getLikesForPost,
  getCommentsForPost,
} from "../../dataconnect/example/.dataconnect-generated";
import { SafeAreaView } from "react-native-safe-area-context";
//import { getUserProfile, listPosts } from "@/src/dataconnect-generated";
import { auth, dc } from "../../services/firebaseConfig";
import {
  getUserProfile,
  listPosts,
  sendFriendRequest as sendFriendRequestMutation,
} from "../../dataconnect/example/.dataconnect-generated";

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
  top?: string | null;
  bottom?: string | null;
  outerwear?: string | null;
  wornAt?: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName?: string | null;
    profilePictureUrl?: string | null;
  };
  likes?: {
    user?: {
      id: string;
    } | null;
  }[];
  comments?: {
    id: string;
    content: string;
    createdAt?: string | null;
    user?: {
      id: string;
      username?: string | null;
      displayName?: string | null;
    } | null;
  }[];
};

export default function Dashboard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUsername, setCurrentUsername] = useState<string>("");

  // like state
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  // comment state
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentInputVisible, setCommentInputVisible] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const inputRefs = useRef<Record<string, TextInput | null>>({});

  const theme = {
    background: isDark ? "#000000" : "#F7F8EC",
    card: isDark ? "#121212" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#111111",
    subtext: isDark ? "#C7C7C7" : "#666666",
    border: isDark ? "#242424" : "#E5E7EB",
    icon: isDark ? "#FFFFFF" : "#111111",
    input: isDark ? "#1E1E1E" : "#F3F4F6",
  };

const loadCurrentUserProfile = useCallback(async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const { data } = await getUserProfile(dc, { id: user.uid });
    const profile = data?.user;
    if (profile?.username) {
      setCurrentUsername(profile.username);
    } else if (profile?.displayName) {
      setCurrentUsername(profile.displayName);
    }
  } catch (error) {
    console.error("Error loading current user profile:", error);
  }
}, []);

const fetchPosts = useCallback(async () => {
  console.log("fetchPosts: starting");
  try {
    const { data } = await listPosts(dc);
    let feedPosts = (data?.posts ?? []) as FeedPost[];

    feedPosts = [...feedPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setPosts(feedPosts);

    const initialLiked: Record<string, boolean> = {};
    const initialCounts: Record<string, number> = {};
    const initialComments: Record<string, Comment[]> = {};

    feedPosts.forEach((post) => {
      initialLiked[post.id] = false;
      initialCounts[post.id] = 0;
      initialComments[post.id] = [];
    });

    setLikedPosts(initialLiked);
    setLikeCounts(initialCounts);
    setComments(initialComments);
  } catch (error) {
    console.error("Error loading posts:", error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, []);

  const loadPostInteractions = useCallback(
  async (postIds: string[]) => {
    const currentUser = auth.currentUser;
    if (!postIds.length) return;

    try {
      const likesResults = await Promise.all(
        postIds.map((postId) => getLikesForPost(dc, { postId: postId as any }))
      );
      const commentsResults = await Promise.all(
        postIds.map((postId) => getCommentsForPost(dc, { postId: postId as any }))
      );

      const nextLiked: Record<string, boolean> = {};
      const nextCounts: Record<string, number> = {};
      const nextComments: Record<string, Comment[]> = {};

      postIds.forEach((postId, index) => {
        const likes = likesResults[index].data?.likes ?? [];
        const postComments = commentsResults[index].data?.comments ?? [];

        nextCounts[postId] = likes.length;
        nextLiked[postId] =
          !!currentUser && likes.some((like) => like.user?.id === currentUser.uid);

        nextComments[postId] = postComments.map((c) => ({
  id: c.id,
  username:
    c.user?.displayName ||
    c.user?.username ||
    c.user?.id ||
    "User",
  text: c.content,
  createdAt: c.createdAt ?? "",
}));
      });

      setLikedPosts(nextLiked);
      setLikeCounts(nextCounts);
      setComments(nextComments);
    } catch (error) {
      console.error("Error loading post interactions:", error);
    }
  },
  []
);

// Friend-request sent state (per target user)
const [friendRequestsSent, setFriendRequestsSent] = useState<
  Record<string, boolean>
>({});

// Load which users I've already sent a request to
const loadSentFriendRequests = useCallback(async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    // TEMP: still Firestore-backed; can be moved to Data Connect later
    const sent: Record<string, boolean> = {};
    // If you removed Firestore entirely, you can just leave this empty
    // and manually mark friendRequestsSent in handleSendFriendRequest.
    setFriendRequestsSent(sent);
  } catch (error) {
    console.error("Error loading sent friend requests:", error);
  }
}, []);

// Refresh handler for pull-to-refresh
const onRefresh = async () => {
  setRefreshing(true);
  await fetchPosts();
  await loadCurrentUserProfile();
  await loadSentFriendRequests();
};

  // useEffect(() => {
  //   loadSentFriendRequests();
  // }, [loadSentFriendRequests]);
  useEffect(() => {
  (async () => {
    await loadCurrentUserProfile();
    await fetchPosts();
    await loadSentFriendRequests();
  })();
}, [loadCurrentUserProfile, fetchPosts, loadSentFriendRequests]);

  const handleSendFriendRequest = async (toUserId: string, toUsername?: string) => {
    const fromUser = auth.currentUser;
    if (!fromUser) {
      Alert.alert("Not signed in", "Please sign in to send friend requests.");
      return;
    }

    if (fromUser.uid === toUserId) {
      Alert.alert("Oops", "You cannot send a friend request to yourself.");
      return;
    }

    if (friendRequestsSent[toUserId]) {
      Alert.alert("Already sent", `Friend request already sent to ${toUsername ?? "this user"}.`);
      return;
    }

    try {
      // const now = new Date().toISOString(); // TimestampString

      await sendFriendRequestMutation(dc, {
        fromUserId: fromUser.uid,
        toUserId,
        createdAt: new Date().toISOString(),
    } as any );

  setFriendRequestsSent((prev: Record<string, boolean>) => ({ ...prev, [toUserId]: true }));
  Alert.alert("Request sent", `Friend request sent to ${toUsername ?? "user"}.`);
} catch (error) {
  console.error("Failed to send friend request:", error);
  Alert.alert("Error", "Could not send friend request.");
}
  };

const handleLike = async (postId: string) => {
  const user = auth.currentUser;
  if (!user) {
    Alert.alert("Not signed in", "Please sign in to like posts.");
    return;
  }

  const isLiked = likedPosts[postId] ?? false;

  // Optimistic UI update
  setLikedPosts((prev) => ({ ...prev, [postId]: !isLiked }));
  setLikeCounts((prev) => ({
    ...prev,
    [postId]: (prev[postId] ?? 0) + (isLiked ? -1 : 1),
  }));

  try {
    if (isLiked) {
      // Unlike
      await deleteLike(dc, {
        postId: postId as any,
        userId: user.uid,
      });
    } else {
      // Like
      await createLike(dc, {
        postId: postId as any,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Failed to update like:", error);
    Alert.alert("Error", "Could not update like. Please try again.");

    // Roll back optimistic update
    setLikedPosts((prev) => ({ ...prev, [postId]: isLiked }));
    setLikeCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] ?? 0) + (isLiked ? 1 : -1),
    }));
  }
};

  const handleCommentToggle = (postId: string) => {
    const isVisible = commentInputVisible[postId] ?? false;
    setCommentInputVisible((prev) => ({ ...prev, [postId]: !isVisible }));

    // Auto focus input when opening
    if (!isVisible) {
      setTimeout(() => {
        inputRefs.current[postId]?.focus();
      }, 100);
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

  const commenter =
    currentUsername ||
    user.displayName ||
    user.email?.split("@")[0] ||
    "You";

  // Optimistic local comment
  const tempComment: Comment = {
    id: `temp-${Date.now()}`,
    username: commenter,
    text,
    createdAt: new Date().toISOString(),
  };

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
      createdAt: new Date().toISOString(),
    });

    // Refresh from server so we have real IDs/order
    await loadPostInteractions([postId]);
  } catch (error) {
    console.error("Failed to post comment:", error);
    Alert.alert("Error", "Could not post comment. Please try again.");

    // Roll back optimistic comment
    setComments((prev) => ({
      ...prev,
      [postId]: (prev[postId] ?? []).filter((c) => c.id !== tempComment.id),
    }));
  }
};

  const formatLocation = (post: FeedPost) => {
    if (post.locationTag) return post.locationTag;
    if (post.zipCode) return post.zipCode;
    return "Unknown location";
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "";
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.background }]} edges={["top"]}>
        <ActivityIndicator size="large" color="#59C1BD" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top"]}>
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
          <Text style={[styles.screenTitle, { color: theme.text }]}>Community Feed</Text>

          {posts.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No posts yet</Text>
              <Text style={[styles.emptyText, { color: theme.subtext }]}>
                No posts yet, time to get creative!
              </Text>
            </View>
          ) : (
            posts.map((post) => {
              console.log("Render post", {
                postId: post.id,
                postUserId: post.user?.id,
                currentUser: auth.currentUser?.uid,
                hasUser: !!post.user,
              });
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
                  {/* Header */}
                  <View style={styles.postHeader}>
                    <Image
                      source={{
                        uri:
                          post.user.profilePictureUrl ||
                          "https://via.placeholder.com/100x100.png?text=User",
                      }}
                      style={styles.avatar}
                    />
                    <View style={styles.headerTextContainer}>
                      <View style={styles.usernameRow}>
                        <Text style={[styles.username, { color: theme.text }]}> 
                          {post.user.username}
                        </Text>
                        {auth.currentUser?.uid !== post.user.id && (
                          <TouchableOpacity
                              style={styles.friendRequestButton}
                              onPress={() => handleSendFriendRequest(post.user.id, post.user.username)}
                              disabled={friendRequestsSent[post.user.id]}
                          >
                            <Text style={styles.friendRequestText}>
                              {friendRequestsSent[post.user.id] ? "Request Sent" : "Add Friend"}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                      <View style={styles.locationRow}>
                        <Ionicons
                          name="location-outline"
                          size={14}
                          color={theme.subtext}
                          style={{ marginRight: 4 }}
                        />
                        <Text style={[styles.locationText, { color: theme.subtext }]}>
                          {formatLocation(post)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Image */}
                  <Image source={{ uri: post.imageUrl }} style={styles.postImage} />

                  {/* Actions */}
                  <View style={styles.actionRow}>
                    <View style={styles.leftActions}>
                      {/* Like */}
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
                        <Text style={[styles.actionCount, { color: liked ? "#f43f5e" : theme.subtext }]}>
                          {likeCount}
                        </Text>
                      </TouchableOpacity>

                      {/* Comment */}
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
                        <Text style={[styles.actionCount, { color: isCommentOpen ? "#59C1BD" : theme.subtext }]}>
                          {commentCount}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.postStatsRow}>
                    <Text style={[styles.postStatsText, { color: theme.subtext }]}> 
                      {likeCount} like{likeCount === 1 ? "" : "s"} · {commentCount} comment{commentCount === 1 ? "" : "s"}
                    </Text>
                  </View>

                  {/* Post Body */}
                  <View style={styles.postBody}>
                    <Text style={[styles.captionUsername, { color: theme.text }]}>
                      {post.user.username}{" "}
                      <Text style={[styles.captionText, { color: theme.text }]}>
                        {post.content}
                      </Text>
                    </Text>

                    {!!post.top && (
                      <Text style={[styles.detailText, { color: theme.text }]}>
                        <Text style={styles.detailLabel}>top:</Text> {post.top}
                      </Text>
                    )}
                    {!!post.bottom && (
                      <Text style={[styles.detailText, { color: theme.text }]}>
                        <Text style={styles.detailLabel}>bottom:</Text> {post.bottom}
                      </Text>
                    )}
                    {!!post.outerwear && (
                      <Text style={[styles.detailText, { color: theme.text }]}>
                        <Text style={styles.detailLabel}>outerwear:</Text> {post.outerwear}
                      </Text>
                    )}

                    <Text style={[styles.dateText, { color: theme.subtext }]}>
                      {formatDate(post.wornAt || post.createdAt)}
                    </Text>
                  </View>

                  {/* Comments List */}
                  {postComments.length > 0 && (
                    <View style={[styles.commentsSection, { borderTopColor: theme.border }]}>
                      {postComments.map((comment) => (
                        <View key={comment.id} style={styles.commentRow}>
                          <Text style={[styles.commentUsername, { color: theme.text }]}>
                            {comment.username}{" "}
                            <Text style={[styles.commentText, { color: theme.text }]}>
                              {comment.text}
                            </Text>
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Comment Input */}
                  {isCommentOpen && (
                    <View style={[styles.commentInputRow, { borderTopColor: theme.border, backgroundColor: theme.input }]}>
                      <TextInput
                        ref={(ref) => { inputRefs.current[post.id] = ref; }}
                        style={[styles.commentInput, { color: theme.text }]}
                        placeholder="Add a comment..."
                        placeholderTextColor={theme.subtext}
                        value={commentText[post.id] ?? ""}
                        onChangeText={(text) =>
                          setCommentText((prev) => ({ ...prev, [post.id]: text }))
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
                            (commentText[post.id] ?? "").trim() ? "#59C1BD" : theme.subtext
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
  container: {
    flex: 1,
  },
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
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  username: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 3,
  },
  friendRequestButton: {
    borderWidth: 1,
    borderColor: "#0D4C92",
    backgroundColor: "#0D4C92",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  friendRequestText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
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
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 4,
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 16,
    lineHeight: 24,
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
  postStatsRow: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  postStatsText: {
    fontSize: 13,
    lineHeight: 18,
  },
});