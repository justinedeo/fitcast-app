import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, dc, NO_CACHE } from "../../services/firebaseConfig";
import { listAllUsers } from "../../src/dataconnect-generated";

const DEFAULT_AVATAR = require("../../assets/images/placeholderImg.png");

type AppUser = {
  id: string;
  username: string;
  displayName?: string | null;
  profilePictureUrl?: string | null;
};

export default function DiscoverPage() {
  const isDark = useColorScheme() === "dark";
  const [users, setUsers] = useState<AppUser[]>([]);
  const [userQuery, setUserQuery] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  const theme = {
    background: isDark ? "#000" : "#F7F8EC",
    text: isDark ? "#fff" : "#111",
    subtext: isDark ? "#D1D5DB" : "#555",
    inputBg: isDark ? "#1A1A1A" : "#fff",
    border: isDark ? "#333" : "#E5E7EB",
  };

  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const { data } = await listAllUsers(dc, NO_CACHE);
        const currentUserId = auth.currentUser?.uid;

        setUsers(
          (data?.users ?? []).filter((u: AppUser) => u.id !== currentUserId)
        );
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = userQuery.trim().toLowerCase();
    if (!query) return [];

    return users.filter((user) => {
      const username = user.username?.toLowerCase() ?? "";
      const displayName = user.displayName?.toLowerCase() ?? "";
      return username.includes(query) || displayName.includes(query);
    });
  }, [userQuery, users]);

  const hasSearched = userQuery.trim().length > 0;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <Text style={[styles.title, { color: theme.text }]}>Discover</Text>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.inputBg,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder="Search users..."
            placeholderTextColor={theme.subtext}
            value={userQuery}
            onChangeText={setUserQuery}
            autoCapitalize="none"
          />
        }
        ListEmptyComponent={
          loadingUsers ? (
            <ActivityIndicator
              size="large"
              color="#59C1BD"
              style={{ marginTop: 40 }}
            />
          ) : (
            <Text style={[styles.emptyText, { color: theme.subtext }]}>
              {hasSearched ? "No users found." : "Search for a user to get started."}
            </Text>
          )
        }
        renderItem={({ item }) => (
          <Pressable
            style={[styles.userRow, { borderBottomColor: theme.border }]}
            onPress={() =>
              router.push({
                pathname: "/userProfile",
                params: { userId: item.id },
              })
            }
          >
            <Image
              source={
                item.profilePictureUrl
                  ? { uri: item.profilePictureUrl }
                  : DEFAULT_AVATAR
              }
              style={styles.avatar}
            />

            <View>
              <Text style={[styles.displayName, { color: theme.text }]}>
                {item.displayName || item.username}
              </Text>
              <Text style={[styles.username, { color: theme.subtext }]}>
                @{item.username}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 32,
    fontWeight: "800",
    paddingHorizontal: 18,
    paddingTop: 8,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 40,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  displayName: {
    fontSize: 16,
    fontWeight: "700",
  },
  username: {
    fontSize: 13,
    marginTop: 2,
  },
});