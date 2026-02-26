import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { auth } from "../../services/firebaseConfig"; // Ensure this path is correct
import { getUserProfile, updateUserProfile } from "../../src/generated/dataconnect"; // Adjust to your SDK path
import { router } from "expo-router";

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
                const { data } = await getUserProfile({ id: user.uid });
                if (data?.user) {
                    setProfile(data.user);
                    setDisplayName(data.user.displayName || "");
                    setBio(data.user.bio || "");
                    setLocation(data.user.location || "");
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

            // 1. Perform the update
            await updateUserProfile({
                id: user.uid,
                displayName: displayName,
                bio: bio,
                location: location,
            });

            // 2. Update local state MANUALLY instead of just fetching
            setProfile((prev: any) => ({
                ...prev,
                displayName,
                bio,
                location
            }));

            setIsEditing(false);
            Alert.alert("Success", "Profile updated!");
        } catch (error) {
            console.error("Update failed:", error);
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
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#59C1BD' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#59C1BD' },
    scrollContainer: { padding: 20, alignItems: 'center' },
    header: { alignItems: 'center', marginVertical: 30 },
    avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#f7f8ec' },
    username: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginTop: 10, fontFamily: 'Epilogue-Bold' },
    email: { fontSize: 14, color: '#f7f8ec', opacity: 0.8 },
    card: { backgroundColor: '#f7f8ec', borderRadius: 20, padding: 25, width: '100%', maxWidth: 400, elevation: 5 },
    label: { fontSize: 12, color: '#0D4C92', fontWeight: 'bold', marginBottom: 5, textTransform: 'uppercase' },
    value: { fontSize: 16, color: '#333', marginBottom: 20, fontFamily: 'Epilogue-Regular' },
    input: { borderBottomWidth: 1, borderBottomColor: '#0D4C92', paddingVertical: 8, marginBottom: 20, fontSize: 16, color: '#333' },
    textArea: { minHeight: 60 },
    button: { paddingVertical: 12, borderRadius: 25, alignItems: 'center', marginTop: 10 },
    editButton: { backgroundColor: '#0D4C92' },
    saveButton: { backgroundColor: '#28a745' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    cancelButton: { marginTop: 15, alignItems: 'center' },
    cancelText: { color: '#8689A0', fontSize: 14 },
    signOutButton: { marginTop: 40, padding: 10 },
    signOutText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16, textDecorationLine: 'underline' },
});

export default ProfilePage;