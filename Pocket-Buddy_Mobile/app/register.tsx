import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { signup, getRoles } from "@/src/services/api";

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRoles()
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setRoles(Array.isArray(data) ? data : []);
      })
      .catch(() => Alert.alert("Error", "Failed to load roles"));
  }, []);

  const handleSignup = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (!roleId) {
      Alert.alert("Error", "Please select a role");
      return;
    }
    setLoading(true);
    try {
      await signup({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        roleId,
      });
      if (Platform.OS === 'web') {
        alert("Account created! Please sign in.");
      } else {
        Alert.alert("Success", "Account created! Please sign in.");
      }
      router.replace("/login");
    } catch (err: unknown) {
      console.log("Signup Error Details:", (err as any).response?.data || (err as any).message || err);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Signup failed or Network Error";
      Alert.alert("Signup Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Join Pocket Buddy</Text>
          <Text style={styles.subtitle}>Sign up to unlock offers</Text>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.half]}
              placeholder="First Name"
              placeholderTextColor="#999"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.input, styles.half]}
              placeholder="Last Name"
              placeholderTextColor="#999"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={[styles.input, styles.picker]}>
            <Text
              style={[styles.pickerText, !roleId && styles.placeholder]}
              onPress={() => { }}
            >
              {roles.find((r) => r._id === roleId)?.name || "Select role"}
            </Text>
          </View>
          {roles.length > 0 && (
            <View style={styles.roleButtons}>
              {roles.map((r) => (
                <TouchableOpacity
                  key={r._id}
                  style={[styles.roleBtn, roleId === r._id && styles.roleBtnActive]}
                  onPress={() => setRoleId(r._id)}
                >
                  <Text
                    style={[
                      styles.roleBtnText,
                      roleId === r._id && styles.roleBtnTextActive,
                    ]}
                  >
                    {r.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={styles.link}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a2e" },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 20 },
  card: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 20,
  },
  row: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },
  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  picker: { height: 48, justifyContent: "center" },
  pickerText: { fontSize: 16, color: "#333" },
  placeholder: { color: "#999" },
  roleButtons: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  roleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  roleBtnActive: { backgroundColor: "#f59e0b" },
  roleBtnText: { color: "#fff", fontSize: 14 },
  roleBtnTextActive: { color: "#fff", fontWeight: "600" },
  btn: {
    backgroundColor: "#f59e0b",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { color: "#fbbf24", textAlign: "center", fontSize: 14 },
});