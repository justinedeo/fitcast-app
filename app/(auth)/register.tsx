import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Register() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Register (Tentative)</Text>
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
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
});