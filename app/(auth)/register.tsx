// import { createUser } from "@/dataconnect/example/dataconnect-generated";
import { createUser } from "@/dataconnect/example/.dataconnect-generated";
import { router } from "expo-router"; // Screen nav
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { FC, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from "../../services/firebaseConfig";

const Register: FC = () => {
  // Form state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSignup = async (): Promise<void> => {
    console.log("Starting signup...")
    setError('');

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Store user profile in firestore
      await createUser({
        id: user.uid,
        username: username,
        email: email,
        displayName: fullName
      });

      // Sign the user out before redirecting to the home page
      await auth.signOut();
      // Route back to login after successful profile creation
      if (Platform.OS == 'web') {
        alert("Success: Profile created successfully!");
        router.replace("/(auth)/login");
      } else {
        Alert.alert(
          "Success",
          "profile created successfully",
          [{ text: "OK", onPress: () => router.replace("/(auth)/login") }]
        );
      }

    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please login or use a different email.");
        Alert.alert("Account Exists", "This email is already in use.");
      } else if (err.code === 'auth/invalid-email') {
        setError("The email address is badly formatted.");
        Alert.alert("Error", "Invalid Email.");
      } else {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#8689A0"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <TextInput
            placeholder="Username"
            placeholderTextColor="#8689A0"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
            returnKeyType="next"
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#8689A0"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            returnKeyType="next"
          />

          <TextInput
            placeholder="Verify Password"
            placeholderTextColor="#8689A0"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
            returnKeyType="next"
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#8689A0"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            returnKeyType="next"
          />

          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#8689A0"
            value={phone}
            onChangeText={setPhone}
            keyboardType="default"  // Norm keyboard to fix return issue
            style={styles.input}
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={() => handleSignup()}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#59C1BD',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'regular',
    marginBottom: 30,
    color: '#FFFFFF',
    fontFamily: 'Epilogue-Regular',
  },
  formContainer: {
    backgroundColor: '#f7f8ec',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#0D4C92',
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#8689A0',
    backgroundColor: 'transparent',
    fontFamily: 'Epilogue-Regular',
  },
  button: {
    width: '60%',
    backgroundColor: '#0D4C92',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Epilogue-Bold',
  },
  error: {
    color: '#ff0000',
    marginTop: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    fontFamily: 'Epilogue-Regular',
  },
});

export default Register;
