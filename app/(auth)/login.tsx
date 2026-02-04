import { router } from "expo-router";
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function Login() 
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => 
    {
        console.log("Logging in with:", username, password);

        router.replace("/(tabs)");
    };

    return (
        <View style={{ 
            flex: 1, 
            justifyContent: "center", 
            padding: 20, backgroundColor: 
            "#59C1BD"}}>

            <Text style={{ fontFamily: "Epilogue-Bold", fontSize: 20}}>
                Login to FitCast
                </Text>

            <TextInput
                placeholder = "Username"
                value={username}
                onChangeText={setUsername}
                style={{borderWidth: 1, marginVertical: 10, padding: 8}}
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ borderWidth: 1, marginVertical: 10, padding: 8}}
            />

            <Button title="Sign In" onPress={handleLogin} />
            </View>
    );
}


