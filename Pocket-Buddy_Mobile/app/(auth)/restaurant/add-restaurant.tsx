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
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  getStates,
  getCitiesByState,
  getAreasByCity,
  getFoodTypes,
  getRestaurantById,
  addRestaurant,
  updateRestaurant,
} from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";
import { API_BASE_URL } from "@/src/config/api";
import axios from "axios";

type Option = { _id: string; name?: string; foodTypeName?: string };

export default function AddRestaurantScreen() {
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const { userId } = useAuth();
  const isEdit = !!editId;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [timings, setTimings] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [foodTypeId, setFoodTypeId] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [states, setStates] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);
  const [areas, setAreas] = useState<Option[]>([]);
  const [foodTypes, setFoodTypes] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getStates().then((r) => setStates(r.data?.data ?? []));
    getFoodTypes().then((r) => setFoodTypes(r.data?.data ?? []));
  }, []);

  useEffect(() => {
    if (stateId) {
      getCitiesByState(stateId).then((r) => setCities(r.data?.data ?? []));
      setCityId("");
      setAreaId("");
    } else setCities([]);
  }, [stateId]);

  useEffect(() => {
    if (cityId) {
      getAreasByCity(cityId).then((r) => setAreas(r.data?.data ?? []));
      setAreaId("");
    } else setAreas([]);
  }, [cityId]);

  useEffect(() => {
    if (editId) {
      getRestaurantById(editId).then((r) => {
        const d = r.data?.data ?? r.data;
        if (d) {
          setTitle(d.title ?? "");
          setCategory(d.category ?? "");
          setDescription(d.description ?? "");
          setTimings(d.timings ?? "");
          setContactNumber(d.contactNumber ?? "");
          setAddress(d.address ?? "");
          setLatitude(String(d.latitude ?? ""));
          setLongitude(String(d.longitude ?? ""));
          setStateId(d.stateId?._id ?? d.stateId ?? "");
          setCityId(d.cityId?._id ?? d.cityId ?? "");
          setAreaId(d.areaId?._id ?? d.areaId ?? "");
          setFoodTypeId(d.foodTypeId?._id ?? d.foodTypeId ?? "");
          setImageUrl(d.imageURL ?? null);
        }
      });
    }
  }, [editId]);

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
    if (!title.trim() || !category.trim() || !description.trim() || !timings.trim()) {
      Alert.alert("Error", "Fill required fields");
      return;
    }
    if (!contactNumber.trim() || !address.trim()) {
      Alert.alert("Error", "Contact and address required");
      return;
    }
    if (!latitude.trim() || !longitude.trim()) {
      Alert.alert("Error", "Latitude and longitude required");
      return;
    }
    if (!cityId || !areaId || !foodTypeId) {
      Alert.alert("Error", "Select state, city, area, and food type");
      return;
    }
    if (!isEdit && !imageUri && !imageUrl) {
      Alert.alert("Error", "Select an image");
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updateRestaurant(editId!, {
          title,
          category,
          description,
          timings,
          contactNumber,
          address,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          cityId,
          areaId,
          foodTypeId,
          stateId: stateId || undefined,
        });
        Alert.alert("Success", "Restaurant updated", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("description", description);
        formData.append("timings", timings);
        formData.append("contactNumber", contactNumber);
        formData.append("address", address);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("cityId", cityId);
        formData.append("areaId", areaId);
        formData.append("foodTypeId", foodTypeId);
        if (stateId) formData.append("stateId", stateId);
        formData.append("userId", userId!);
        formData.append("active", "true");

        if (imageUri) {
          const filename = imageUri.split("/").pop() || "photo.jpg";
          const type = "image/jpeg";
          formData.append("image", {
            uri: imageUri,
            name: filename,
            type,
          } as any);
        }

        await axios.post(`${API_BASE_URL}/location/addWithFile`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          transformRequest: [(data) => data],
        });
        Alert.alert("Success", "Restaurant added", [
          { text: "OK", onPress: () => router.replace("/(auth)/restaurant/my-restaurant") },
        ]);
      }
    } catch (e: any) {
      Alert.alert("Error", e.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const renderPicker = (
    label: string,
    value: string,
    options: Option[],
    onChange: (id: string) => void,
    key: "name" | "foodTypeName" = "name"
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map((o) => (
          <TouchableOpacity
            key={o._id}
            style={[styles.chip, value === o._id && styles.chipActive]}
            onPress={() => onChange(o._id)}
          >
            <Text style={[styles.chipText, value === o._id && styles.chipTextActive]}>
              {o[key] || o.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.field}>
        <Text style={styles.label}>Restaurant Name *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter name"
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Category *</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="e.g. Fine Dining"
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your restaurant"
          multiline
          numberOfLines={3}
        />
      </View>
      <View style={styles.row}>
        <View style={[styles.field, styles.half]}>
          <Text style={styles.label}>Timings *</Text>
          <TextInput
            style={styles.input}
            value={timings}
            onChangeText={setTimings}
            placeholder="10 AM - 10 PM"
          />
        </View>
        <View style={[styles.field, styles.half]}>
          <Text style={styles.label}>Contact *</Text>
          <TextInput
            style={styles.input}
            value={contactNumber}
            onChangeText={setContactNumber}
            placeholder="10-digit number"
            keyboardType="phone-pad"
          />
        </View>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={address}
          onChangeText={setAddress}
          placeholder="Full address"
          multiline
        />
      </View>
      <View style={styles.row}>
        <View style={[styles.field, styles.half]}>
          <Text style={styles.label}>Latitude *</Text>
          <TextInput
            style={styles.input}
            value={latitude}
            onChangeText={setLatitude}
            placeholder="e.g. 28.6139"
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.field, styles.half]}>
          <Text style={styles.label}>Longitude *</Text>
          <TextInput
            style={styles.input}
            value={longitude}
            onChangeText={setLongitude}
            placeholder="e.g. 77.2090"
            keyboardType="numeric"
          />
        </View>
      </View>
      {renderPicker("State", stateId, states, setStateId)}
      {renderPicker("City", cityId, cities, setCityId)}
      {renderPicker("Area", areaId, areas, setAreaId)}
      {renderPicker("Food Type", foodTypeId, foodTypes, setFoodTypeId, "foodTypeName")}

      {!isEdit && (
        <View style={styles.field}>
          <Text style={styles.label}>Image *</Text>
          <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
            <Text style={styles.imageBtnText}>
              {imageUri ? "Change Image" : "Select Image"}
            </Text>
          </TouchableOpacity>
          {(imageUri || imageUrl) && (
            <Text style={styles.imageHint}>✓ Image selected</Text>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.disabled]}
        onPress={submit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>
            {isEdit ? "Update Restaurant" : "Add Restaurant"}
          </Text>
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
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#e2e8f0",
    marginRight: 8,
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
  imageHint: { marginTop: 8, color: "#16a34a", fontSize: 14 },
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
