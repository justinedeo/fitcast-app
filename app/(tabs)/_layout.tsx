import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#0D4C92",
        tabBarInactiveTintColor: "#8689A0",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 10,
        },
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "home":
              return <Ionicons name="sunny" size={size} color={color} />;

            case "dashboard":
              return (
                <MaterialCommunityIcons
                  name="account-group"
                  size={size}
                  color={color}
                />
              );

            case "discover":
              return <Ionicons name="globe-sharp" size={size} color={color} />;

            case "post":
              return <Ionicons name="add-circle" size={40} color="#0D4C92" />;

            case "profile":
              return <Ionicons name="home" size={size} color={color} />;

            case "editProfile":
              return <Ionicons name="pencil" size={size} color={color} />;

            default:
              return null;
          }
        },
      })}
    >
      {/* Hides index*/}
      <Tabs.Screen name="index" options={{ href: null }} />

      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="dashboard" options={{ title: "Community" }} />
      <Tabs.Screen name="discover" options={{ title: "Discover" }} />
      <Tabs.Screen name="post" options={{ title: "Post" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />

      {/* hidden */}
      <Tabs.Screen name="editProfile" options={{ href: null }} />
    </Tabs>
  );
}