import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { auth } from "../../services/firebaseConfig";
// changed to email
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
    const [email, setEmail] = useState(""); // Changed 'username' to 'email' to match Firebase Auth
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            // Authenticate w/ firebase
            await signInWithEmailAndPassword(auth, email, password);
            
            console.log("Login successful!");
            // Route on successful login check
            router.replace("/(tabs)");
        } catch (error: any) {
            // Error handling
            console.error("Login error:", error.message);
            Alert.alert("Login Failed", "Please check your email and password.");
        }
    };

    return (
        <View style={{ 
            flex: 1, 
            justifyContent: "center", 
            padding: 20, 
            backgroundColor: "#59C1BD"
        }}>
            <Text style={{ fontFamily: "Epilogue-Bold", fontSize: 20 }}>
                Login to FitCast
            </Text>

            <TextInput
                placeholder="Email Address" // Email for firebase
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                style={{ borderWidth: 1, marginVertical: 10, padding: 8, backgroundColor: 'white' }}
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ borderWidth: 1, marginVertical: 10, padding: 8, backgroundColor: 'white' }}
            />

            <Button title="Sign In" onPress={handleLogin} />
        </View>
    );
}