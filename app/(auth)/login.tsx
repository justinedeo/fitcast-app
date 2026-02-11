import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { auth } from "../../services/firebaseConfig";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("/(tabs)/home");
        } catch (error: any) {
            Alert.alert("Login Failed", "Please check your email and password.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login to FitCast</Text>

            <TextInput
                placeholder="Email Address"
                placeholderTextColor="#8689A0"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                style={styles.input}
            />

            <TextInput
                placeholder="Password"
                placeholderTextColor="#8689A0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            {/* Sign In Button */}
            <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign In</Text>
            </Pressable>

            {/* New to FitCast? Sign up*/}
            <Pressable 
                onPress={() => router.push("/(auth)/register")}
                style={{ marginTop: 20 }}
            >
                <Text style={styles.footerText}>
                    New to FitCast? <Text style={{ fontWeight: 'bold' }}>Sign up</Text>
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#59C1BD",
    },
    title: {
        fontSize: 24,
        color: "white",
        marginBottom: 20,
        fontWeight: "600",
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#F0F5E9",
        borderRadius: 10,
        paddingHorizontal: 15,
        marginVertical: 10,
        color: "#8689A0",
        fontSize: 16,

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    button: {
        backgroundColor: "#134E96",
        paddingVertical: 12,
        paddingHorizontal: 60,
        borderRadius: 25,
        marginTop: 30,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    footerText: {
        color: "white",
        fontSize: 14,
    },
});