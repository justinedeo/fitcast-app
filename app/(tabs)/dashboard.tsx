import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db, dc } from "../../services/firebaseConfig";
import { listPosts } from "../../src/dataconnect-generated";

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
};

export default function Dashboard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const fetchPosts = useCallback(async () => {
    try {
      const { data } = await listPosts(dc);
      const feedPosts = data?.posts ?? [];

      const sorted = [...feedPosts].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setPosts(sorted as FeedPost[]);

      const initialCounts: Record<string, number> = {};
      const initialComments: Record<string, Comment[]> = {};
      sorted.forEach((p) => {
        initialCounts[p.id] = 0;
        initialComments[p.id] = [];
      });
      setLikeCounts(initialCounts);
      setComments(initialComments);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    await loadSentFriendRequests();
  };

  const [friendRequestsSent, setFriendRequestsSent] = useState<Record<string, boolean>>({});

  const loadSentFriendRequests = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(
        collection(db, "friendRequests"),
        where("fromId", "==", user.uid)
      );
      const snap = await getDocs(q);
      const sent: Record<string, boolean> = {};
      snap.forEach((doc) => {
        const data = doc.data();
        if (data?.toId) {
          sent[data.toId] = true;
        }
      });
      setFriendRequestsSent(sent);
    } catch (error) {
      console.error("Error loading sent friend requests:", error);
    }
  }, []);

  useEffect(() => {
    loadSentFriendRequests();
  }, [loadSentFriendRequests]);

  const sendFriendRequest = async (toUserId: string, toUsername?: string) => {
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
      const requestId = `${fromUser.uid}_${toUserId}`;
      await setDoc(doc(db, "friendRequests", requestId), {
        fromId: fromUser.uid,
        toId: toUserId,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setFriendRequestsSent((prev) => ({ ...prev, [toUserId]: true }));
      Alert.alert("Request sent", `Friend request sent to ${toUsername ?? "user"}.`);
    } catch (error) {
      console.error("Failed to send friend request:", error);
      Alert.alert("Error", "Could not send friend request.");
    }
  };

  const handleLike = (postId: string) => {
    const isLiked = likedPosts[postId] ?? false;
    setLikedPosts((prev) => ({ ...prev, [postId]: !isLiked }));
    setLikeCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] ?? 0) + (isLiked ? -1 : 1),
    }));
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

  const handlePostComment = (postId: string, username: string) => {
    const text = (commentText[postId] ?? "").trim();
    if (!text) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      username,
      text,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] ?? []), newComment],
    }));

    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    setCommentInputVisible((prev) => ({ ...prev, [postId]: false }));
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
                            onPress={() => sendFriendRequest(post.user.id, post.user.username)}
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
                        onSubmitEditing={() => handlePostComment(post.id, post.user.username)}
                        returnKeyType="send"
                        multiline={false}
                      />
                      <TouchableOpacity
                        onPress={() => handlePostComment(post.id, post.user.username)}
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
});