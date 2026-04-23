// import { router } from "expo-router";
// import {
//     collection,
//     deleteDoc,
//     doc,
//     getDoc,
//     getDocs,
//     query,
//     updateDoc,
//     where,
// } from "firebase/firestore";
// import React, { useEffect, useState } from 'react';
// import {
//     ActivityIndicator,
//     Alert,
//     Image,
//     KeyboardAvoidingView,
//     Platform,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import { auth, db } from "../../services/firebaseConfig";

// const ProfilePage = () => {
//     const [loading, setLoading] = useState(true);
//     const [isEditing, setIsEditing] = useState(false);
//     const [profile, setProfile] = useState<any>(null);

//     const [displayName, setDisplayName] = useState("");
//     const [bio, setBio] = useState("");
//     const [location, setLocation] = useState("");

//     const [incomingRequests, setIncomingRequests] = useState<Array<{ requestId: string; fromId: string; fromUser?: any }>>([]);
//     const [friends, setFriends] = useState<Array<any>>([]);
//     const [friendLoading, setFriendLoading] = useState(false);

//     useEffect(() => {
//         fetchProfile();
//         loadFriendData();
//     }, []);

//     const loadFriendData = async () => {
//         const user = auth.currentUser;
//         if (!user) return;

//         setFriendLoading(true);

//         try {
//             const pendingQuery = query(
//                 collection(db, "friendRequests"),
//                 where("toId", "==", user.uid),
//                 where("status", "==", "pending")
//             );

//             const acceptedFromMeQuery = query(
//                 collection(db, "friendRequests"),
//                 where("fromId", "==", user.uid),
//                 where("status", "==", "accepted")
//             );

//             const acceptedToMeQuery = query(
//                 collection(db, "friendRequests"),
//                 where("toId", "==", user.uid),
//                 where("status", "==", "accepted")
//             );

//             const [pendingSnap, acceptedFromMeSnap, acceptedToMeSnap] = await Promise.all([
//                 getDocs(pendingQuery),
//                 getDocs(acceptedFromMeQuery),
//                 getDocs(acceptedToMeQuery),
//             ]);

//             const bringFriendIds = new Set<string>();
//             const pendingItems: Array<{ requestId: string; fromId: string }> = [];

//             pendingSnap.forEach((snap) => {
//                 const data = snap.data();
//                 if (data?.fromId) {
//                     pendingItems.push({ requestId: snap.id, fromId: data.fromId });
//                     bringFriendIds.add(data.fromId);
//                 }
//             });

//             const friendIds = new Set<string>();
//             acceptedFromMeSnap.forEach((snap) => {
//                 const data = snap.data();
//                 if (data?.toId) friendIds.add(data.toId);
//             });
//             acceptedToMeSnap.forEach((snap) => {
//                 const data = snap.data();
//                 if (data?.fromId) friendIds.add(data.fromId);
//             });

//             const userIdsToLoad = Array.from(new Set([...bringFriendIds, ...friendIds]));
//             const userById: Record<string, any> = {};

//             await Promise.all(
//                 userIdsToLoad.map(async (uid) => {
//                     const userDoc = await getDoc(doc(db, "users", uid));
//                     if (userDoc.exists()) {
//                         userById[uid] = userDoc.data();
//                     }
//                 })
//             );

//             setIncomingRequests(
//                 pendingItems.map((item) => ({ ...item, fromUser: userById[item.fromId] }))
//             );

//             setFriends(Array.from(friendIds).map((uid) => userById[uid]).filter(Boolean));
//         } catch (err) {
//             console.error("Error loading friend data:", err);
//             Alert.alert("Error", "Could not load friends data.");
//         } finally {
//             setFriendLoading(false);
//         }
//     };

//     const acceptFriendRequest = async (requestId: string) => {
//         try {
//             await updateDoc(doc(db, "friendRequests", requestId), { status: "accepted" });
//             await loadFriendData();
//             Alert.alert("Friend added", "Friend request accepted.");
//         } catch (err) {
//             console.error("Error accepting friend request:", err);
//             Alert.alert("Error", "Could not accept friend request.");
//         }
//     };

//     const declineFriendRequest = async (requestId: string) => {
//         try {
//             await deleteDoc(doc(db, "friendRequests", requestId));
//             await loadFriendData();
//             Alert.alert("Declined", "Friend request declined.");
//         } catch (err) {
//             console.error("Error declining friend request:", err);
//             Alert.alert("Error", "Could not decline friend request.");
//         }
//     };

//     const fetchProfile = async () => {
//         try {
//             const user = auth.currentUser;
//             if (user) {
//                 const userDoc = await getDoc(doc(db, "users", user.uid));
//                 if (userDoc.exists()) {
//                     const userData = userDoc.data();
//                     setProfile(userData);
//                     setDisplayName(userData.displayName || "");
//                     setBio(userData.bio || "");
//                     setLocation(userData.location || "");
//                 }
//             }
//         } catch (err) {
//             console.error("Error fetching profile:", err);
//             Alert.alert("Error", "Could not load profile data.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleUpdate = async () => {
//         try {
//             const user = auth.currentUser;
//             if (!user) return;

//             setLoading(true);

//             await updateDoc(doc(db, "users", user.uid), {
//                 displayName,
//                 bio,
//                 location,
//             });

//             setProfile((prev: any) => ({
//                 ...prev,
//                 displayName,
//                 bio,
//                 location,
//             }));

//             setIsEditing(false);
//             Alert.alert("Success", "Profile updated!");
//         } catch (err) {
//             console.error("Update failed:", err);
//             Alert.alert("Error", "Could not update profile.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSignOut = async () => {
//         try {
//             await auth.signOut();
//             router.replace("/(auth)/login");
//         } catch (err) {
//             console.error("Sign out error:", err);
//             Alert.alert("Error", "Failed to sign out.");
//         }
//     };

//     if (loading && !profile) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#0D4C92" />
//             </View>
//         );
//     }

//     return (
//         <KeyboardAvoidingView
//             style={styles.container}
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         >
//             <ScrollView contentContainerStyle={styles.scrollContainer}>
//                 <View style={styles.header}>
//                     <Image
//                         source={{ uri: profile?.profilePictureUrl || 'https://via.placeholder.com/150' }}
//                         style={styles.avatar}
//                     />
//                     <Text style={styles.username}>@{profile?.username || 'user'}</Text>
//                     <Text style={styles.email}>{profile?.email}</Text>
//                 </View>

//                 <View style={styles.card}>
//                     <Text style={styles.label}>Display Name</Text>
//                     {isEditing ? (
//                         <TextInput
//                             style={styles.input}
//                             value={displayName}
//                             onChangeText={setDisplayName}
//                             placeholder="Enter display name"
//                         />
//                     ) : (
//                         <Text style={styles.value}>{profile?.displayName || "Not set"}</Text>
//                     )}

//                     <Text style={styles.label}>Bio</Text>
//                     {isEditing ? (
//                         <TextInput
//                             style={[styles.input, styles.textArea]}
//                             value={bio}
//                             onChangeText={setBio}
//                             placeholder="Tell us about yourself"
//                             multiline
//                         />
//                     ) : (
//                         <Text style={styles.value}>{profile?.bio || "No bio added yet."}</Text>
//                     )}

//                     <Text style={styles.label}>Location</Text>
//                     {isEditing ? (
//                         <TextInput
//                             style={styles.input}
//                             value={location}
//                             onChangeText={setLocation}
//                             placeholder="e.g. College Station, TX"
//                         />
//                     ) : (
//                         <Text style={styles.value}>{profile?.location || "Not set"}</Text>
//                     )}

//                     <TouchableOpacity
//                         style={[styles.button, isEditing ? styles.saveButton : styles.editButton]}
//                         onPress={isEditing ? handleUpdate : () => setIsEditing(true)}
//                     >
//                         <Text style={styles.buttonText}>{isEditing ? "Save Changes" : "Edit Profile"}</Text>
//                     </TouchableOpacity>

//                     {isEditing && (
//                         <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
//                             <Text style={styles.cancelText}>Cancel</Text>
//                         </TouchableOpacity>
//                     )}
//                 </View>

//                 <View style={styles.card}>
//                     <Text style={styles.sectionTitle}>Friend Requests</Text>
//                     {friendLoading ? (
//                         <ActivityIndicator size="small" color="#0D4C92" />
//                     ) : incomingRequests.length === 0 ? (
//                         <Text style={styles.value}>No requests right now</Text>
//                     ) : (
//                         incomingRequests.map((req) => (
//                             <View key={req.requestId} style={styles.requestRow}>
//                                 <Text style={styles.requestText}>
//                                     {req.fromUser?.displayName || req.fromUser?.username || req.fromId}
//                                 </Text>
//                                 <View style={styles.requestActions}>
//                                     <TouchableOpacity
//                                         style={[styles.friendActionButton, styles.acceptButton]}
//                                         onPress={() => acceptFriendRequest(req.requestId)}
//                                     >
//                                         <Text style={styles.friendActionText}>Accept</Text>
//                                     </TouchableOpacity>
//                                     <TouchableOpacity
//                                         style={[styles.friendActionButton, styles.declineButton]}
//                                         onPress={() => declineFriendRequest(req.requestId)}
//                                     >
//                                         <Text style={styles.friendActionText}>Decline</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             </View>
//                         ))
//                     )}

//                     <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Friends</Text>
//                     {friends.length === 0 ? (
//                         <Text style={styles.value}>No friends yet. Add some from feed.</Text>
//                     ) : (
//                         friends.map((friend) => (
//                             <View key={friend?.uid || friend?.id || friend?.username} style={styles.requestRow}>
//                                 <Text style={styles.requestText}>{friend?.displayName || friend?.username || "Username"}</Text>
//                             </View>
//                         ))
//                     )}
//                 </View>

//                 <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
//                     <Text style={styles.signOutText}>Sign Out</Text>
//                 </TouchableOpacity>
//             </ScrollView>
//         </KeyboardAvoidingView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#59C1BD',
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#59C1BD',
//     },
//     scrollContainer: {
//         flexGrow: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     header: {
//         alignItems: 'center',
//         marginBottom: 30,
//     },
//     avatar: {
//         width: 120,
//         height: 120,
//         borderRadius: 60,
//         borderWidth: 4,
//         borderColor: '#f7f8ec',
//     },
//     username: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         color: '#FFFFFF',
//         marginTop: 10,
//         fontFamily: 'Epilogue-Bold',
//     },
//     email: {
//         fontSize: 14,
//         color: '#f7f8ec',
//         opacity: 0.8,
//     },
//     card: {
//         backgroundColor: '#f7f8ec',
//         borderRadius: 20,
//         padding: 25,
//         width: '100%',
//         maxWidth: 400,
//         elevation: 5,
//     },
//     label: {
//         fontSize: 12,
//         color: '#0D4C92',
//         fontWeight: 'bold',
//         marginBottom: 5,
//         textTransform: 'uppercase',
//     },
//     value: {
//         fontSize: 16,
//         color: '#333',
//         marginBottom: 20,
//         fontFamily: 'Epilogue-Regular',
//     },
//     input: {
//         borderBottomWidth: 1,
//         borderBottomColor: '#0D4C92',
//         paddingVertical: 8,
//         marginBottom: 20,
//         fontSize: 16,
//         color: '#333',
//     },
//     textArea: {
//         minHeight: 60,
//     },
//     button: {
//         paddingVertical: 12,
//         borderRadius: 25,
//         alignItems: 'center',
//         marginTop: 10,
//     },
//     editButton: {
//         backgroundColor: '#0D4C92',
//     },
//     saveButton: {
//         backgroundColor: '#28a745',
//     },
//     buttonText: {
//         color: '#fff',
//         fontWeight: 'bold',
//         fontSize: 16,
//     },
//     cancelButton: {
//         marginTop: 15,
//         alignItems: 'center',
//     },
//     cancelText: {
//         color: '#8689A0',
//         fontSize: 14,
//     },
//     signOutButton: {
//         marginTop: 40,
//         padding: 10,
//     },
//     signOutText: {
//         color: '#FFFFFF',
//         fontWeight: 'bold',
//         fontSize: 16,
//         textDecorationLine: 'underline',
//     },
//     sectionTitle: {
//         fontSize: 18,
//         fontWeight: '700',
//         color: '#0D4C92',
//         marginBottom: 8,
//     },
//     requestRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginBottom: 10,
//     },
//     requestText: {
//         fontSize: 14,
//         color: '#333',
//         flex: 1,
//     },
//     requestActions: {
//         flexDirection: 'row',
//         gap: 8,
//         marginLeft: 10,
//     },
//     friendActionButton: {
//         paddingHorizontal: 10,
//         paddingVertical: 6,
//         borderRadius: 14,
//         minWidth: 74,
//         alignItems: 'center',
//     },
//     acceptButton: {
//         backgroundColor: '#28a745',
//     },
//     declineButton: {
//         backgroundColor: '#dc3545',
//     },
//     friendActionText: {
//         color: '#fff',
//         fontSize: 12,
//         fontWeight: '700',
//     },
// });

// export default ProfilePage;
// app/(tabs)/profile.tsx

// app/(tabs)/profile.tsx

import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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
} from "react-native";
import { auth } from "../../services/firebaseConfig";

// Data Connect generated SDK (from dataconnect/example/dataconnect-generated/index.d.ts)
import {
  getUserProfile,
  getIncomingRequests,
  getFriends,
  updateUserProfile,
  acceptFriendRequest,
  declineFriendRequest,
  type GetUserProfileData,
  type GetIncomingRequestsData,
  type GetFriendsData,
} from "../../dataconnect/example/dataconnect-generated";

const ProfilePage = () => {
  const user = auth.currentUser;
  const userId = user?.uid ?? "";

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<
    GetUserProfileData["user"] | null
  >(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  const [incomingRequests, setIncomingRequests] = useState<
    GetIncomingRequestsData["friendRequests"]
  >([]);
  const [friendsRows, setFriendsRows] = useState<
    GetFriendsData["friendRequests"]
  >([]);

  const [profileLoading, setProfileLoading] = useState(true);
  const [incomingLoading, setIncomingLoading] = useState(false);
  const [friendsLoading, setFriendsLoading] = useState(false);

  // Derive "other user" objects from accepted friend requests
  const friends = useMemo(() => {
    return friendsRows
      .map((req) => {
        const from = req.fromUser;
        const to = req.toUser;
        if (!from || !to) return null;
        const isFromMe = from.id === userId;
        return isFromMe ? to : from;
      })
      .filter((u): u is NonNullable<typeof u> => Boolean(u));
  }, [friendsRows, userId]);

  // Load profile
  const loadProfile = async () => {
    if (!userId) return;
    setProfileLoading(true);
    try {
      const res = await getUserProfile({ id: userId });
      const p = res.data?.user ?? null;
      setProfile(p);
      if (p) {
        setDisplayName(p.displayName ?? "");
        setBio(p.bio ?? "");
        setLocation(p.location ?? "");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      Alert.alert("Error", "Could not load profile data.");
    } finally {
      setProfileLoading(false);
    }
  };

  // Load incoming friend requests
  const loadIncoming = async () => {
    if (!userId) return;
    setIncomingLoading(true);
    try {
      const res = await getIncomingRequests({ userId });
      setIncomingRequests(res.data?.friendRequests ?? []);
    } catch (err) {
      console.error("Error loading incoming requests:", err);
      Alert.alert("Error", "Could not load friend requests.");
    } finally {
      setIncomingLoading(false);
    }
  };

  // Load friends (accepted requests)
  const loadFriends = async () => {
    if (!userId) return;
    setFriendsLoading(true);
    try {
      const res = await getFriends({ userId });
      setFriendsRows(res.data?.friendRequests ?? []);
    } catch (err) {
      console.error("Error loading friends:", err);
      Alert.alert("Error", "Could not load friends.");
    } finally {
      setFriendsLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    loadProfile();
    loadIncoming();
    loadFriends();
  }, [userId]);

  const handleUpdate = async () => {
    if (!user || !profile) return;

    try {
      setProfileLoading(true);
      await updateUserProfile({
        id: user.uid,
        username: profile.username,
        email: user.email ?? "",
        displayName,
        bio,
        location,
        profilePictureUrl: profile.profilePictureUrl ?? null,
      });
      await loadProfile();
      setIsEditing(false);
      Alert.alert("Success", "Profile updated!");
    } catch (err) {
      console.error("Update failed:", err);
      Alert.alert("Error", "Could not update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await acceptFriendRequest({ id: requestId });
      await Promise.all([loadIncoming(), loadFriends()]);
      Alert.alert("Friend added", "Friend request accepted.");
    } catch (err) {
      console.error("Error accepting friend request:", err);
      Alert.alert("Error", "Could not accept friend request.");
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await declineFriendRequest({ id: requestId });
      await loadIncoming();
      Alert.alert("Declined", "Friend request declined.");
    } catch (err) {
      console.error("Error declining friend request:", err);
      Alert.alert("Error", "Could not decline friend request.");
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.replace("/(auth)/login");
    } catch (err) {
      console.error("Sign out error:", err);
      Alert.alert("Error", "Failed to sign out.");
    }
  };

  if (!userId || (profileLoading && !profile)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D4C92" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={{
              uri:
                profile?.profilePictureUrl ||
                "https://via.placeholder.com/150",
            }}
            style={styles.avatar}
          />
          <Text style={styles.username}>@{profile?.username || "user"}</Text>
          <Text style={styles.email}>{user?.email || ""}</Text>
        </View>

        {/* PROFILE CARD */}
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
            style={[
              styles.button,
              isEditing ? styles.saveButton : styles.editButton,
            ]}
            onPress={isEditing ? handleUpdate : () => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Text>
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* FRIEND REQUESTS + FRIENDS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Friend Requests</Text>
          {incomingLoading ? (
            <ActivityIndicator size="small" color="#0D4C92" />
          ) : incomingRequests.length === 0 ? (
            <Text style={styles.value}>No requests right now</Text>
          ) : (
            incomingRequests.map((req) => (
              <View key={req.id} style={styles.requestRow}>
                <Text style={styles.requestText}>
                  {req.fromUser.displayName ||
                    req.fromUser.username ||
                    req.fromUser.id}
                </Text>
                <View style={styles.requestActions}>
                  <TouchableOpacity
                    style={[styles.friendActionButton, styles.acceptButton]}
                    onPress={() => handleAccept(req.id)}
                  >
                    <Text style={styles.friendActionText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.friendActionButton, styles.declineButton]}
                    onPress={() => handleDecline(req.id)}
                  >
                    <Text style={styles.friendActionText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Friends</Text>
          {friendsLoading ? (
            <ActivityIndicator size="small" color="#0D4C92" />
          ) : friends.length === 0 ? (
            <Text style={styles.value}>
              No friends yet. Add some from feed.
            </Text>
          ) : (
            friends.map((friend) => (
              <View
                key={friend.id}
                style={styles.requestRow}
              >
                <Text style={styles.requestText}>
                  {friend.displayName || friend.username || "Username"}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* SIGN OUT */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#59C1BD",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#59C1BD",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#f7f8ec",
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 10,
    fontFamily: "Epilogue-Bold",
  },
  email: {
    fontSize: 14,
    color: "#f7f8ec",
    opacity: 0.8,
  },
  card: {
    backgroundColor: "#f7f8ec",
    borderRadius: 20,
    padding: 25,
    width: "100%",
    maxWidth: 400,
    elevation: 5,
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: "#0D4C92",
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    fontFamily: "Epilogue-Regular",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#0D4C92",
    paddingVertical: 8,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    minHeight: 60,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#0D4C92",
  },
  saveButton: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
    alignItems: "center",
  },
  cancelText: {
    color: "#8689A0",
    fontSize: 14,
  },
  signOutButton: {
    marginTop: 40,
    padding: 10,
  },
  signOutText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0D4C92",
    marginBottom: 8,
  },
  requestRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  requestText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  requestActions: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 10,
  },
  friendActionButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    minWidth: 74,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#28a745",
  },
  declineButton: {
    backgroundColor: "#dc3545",
  },
  friendActionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});

export default ProfilePage;