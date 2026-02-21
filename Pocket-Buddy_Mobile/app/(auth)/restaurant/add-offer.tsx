import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { getRestaurantsByUserId, addOffer } from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";
import { API_BASE_URL } from "@/src/config/api";
import axios from "axios";

export default function AddOfferScreen() {
  const { userId } = useAuth();
  const [restaurants, setRestaurants] = useState<{ _id: string; title: string }[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [offer_type, setOfferType] = useState<
    "Flat Discount" | "Percentage Discount"
  >("Flat Discount");
  const [discount_value, setDiscountValue] = useState("");
  const [valid_from, setValidFrom] = useState("");
  const [valid_to, setValidTo] = useState("");
  const [min_order_value, setMinOrderValue] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getRestaurantsByUserId(userId).then((res) => {
      const data = res.data?.data ?? res.data ?? [];
      const list = Array.isArray(data) ? data : [];
      setRestaurants(list);
      if (list.length > 0 && !selectedRestaurantId) setSelectedRestaurantId(list[0]._id);
    });
  }, [userId]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow access to photos");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const submit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Title and description required");
      return;
    }
    if (!discount_value || isNaN(Number(discount_value))) {
      Alert.alert("Error", "Valid discount value required");
      return;
    }
    if (!valid_from || !valid_to) {
      Alert.alert("Error", "Valid from and to dates required");
      return;
    }
    if (!selectedRestaurantId) {
      Alert.alert("Error", "Select a restaurant");
      return;
    }
    if (!imageUri) {
      Alert.alert("Error", "Select an image");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("offer_type", offer_type);
      formData.append("discount_value", discount_value);
      formData.append("valid_from", valid_from);
      formData.append("valid_to", valid_to);
      formData.append("status", "Active");
      formData.append("requires_approval", "false");
      if (min_order_value) formData.append("min_order_value", min_order_value);
      formData.append("restaurant_ids", selectedRestaurantId);

      const filename = imageUri.split("/").pop() || "photo.jpg";
      formData.append("image", {
        uri: imageUri,
        name: filename,
        type: "image/jpeg",
      } as any);

      await axios.post(`${API_BASE_URL}/offer/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: [(data) => data],
      });
      Alert.alert("Success", "Offer added", [
        { text: "OK", onPress: () => router.replace("/(auth)/restaurant/my-offers") },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e.response?.data?.message || "Failed to add offer");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.field}>
        <Text style={styles.label}>Restaurant *</Text>
        <View style={styles.chipRow}>
          {restaurants.map((r) => (
            <TouchableOpacity
              key={r._id}
              style={[
                styles.chip,
                selectedRestaurantId === r._id && styles.chipActive,
              ]}
              onPress={() => setSelectedRestaurantId(r._id)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedRestaurantId === r._id && styles.chipTextActive,
                ]}
              >
                {r.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Offer title"
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          multiline
        />
      </View>
      <View style={styles.row}>
        <View style={[styles.field, styles.half]}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.chip,
                offer_type === "Flat Discount" && styles.chipActive,
              ]}
              onPress={() => setOfferType("Flat Discount")}
            >
              <Text
                style={[
                  styles.chipText,
                  offer_type === "Flat Discount" && styles.chipTextActive,
                ]}
              >
                Flat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chip,
                offer_type === "Percentage Discount" && styles.chipActive,
              ]}
              onPress={() => setOfferType("Percentage Discount")}
            >
              <Text
                style={[
                  styles.chipText,
                  offer_type === "Percentage Discount" && styles.chipTextActive,
                ]}
              >
                %
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.field, styles.half]}>
          <Text style={styles.label}>Discount Value *</Text>
          <TextInput
            style={styles.input}
            value={discount_value}
            onChangeText={setDiscountValue}
            placeholder={offer_type === "Percentage Discount" ? "e.g. 20" : "e.g. 100"}
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.field, styles.half]}>
          <Text style={styles.label}>Valid From *</Text>
          <TextInput
            style={styles.input}
            value={valid_from}
            onChangeText={setValidFrom}
            placeholder="YYYY-MM-DD"
          />
        </View>
        <View style={[styles.field, styles.half]}>
          <Text style={styles.label}>Valid To *</Text>
          <TextInput
            style={styles.input}
            value={valid_to}
            onChangeText={setValidTo}
            placeholder="YYYY-MM-DD"
          />
        </View>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Min Order (₹)</Text>
        <TextInput
          style={styles.input}
          value={min_order_value}
          onChangeText={setMinOrderValue}
          placeholder="Optional"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Image *</Text>
        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Text style={styles.imageBtnText}>
            {imageUri ? "Change Image" : "Select Image"}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.disabled]}
        onPress={submit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Add Offer</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20, paddingBottom: 40 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  textArea: { minHeight: 80 },
  row: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#e2e8f0",
  },
  chipActive: { backgroundColor: "#f59e0b" },
  chipText: { fontSize: 14 },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  imageBtn: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  imageBtnText: { color: "#fff", fontWeight: "600" },
  submitBtn: {
    backgroundColor: "#f59e0b",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  disabled: { opacity: 0.7 },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
