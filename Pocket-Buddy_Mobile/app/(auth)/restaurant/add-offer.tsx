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
  Modal,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { getRestaurantsByUserId, addOffer } from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";

// ──── Custom Date Picker ──────────────────────────────────────────────────────
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function DatePickerModal({
  visible,
  title,
  initialDate,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  initialDate: Date | null;
  onConfirm: (d: Date) => void;
  onCancel: () => void;
}) {
  const today = new Date();
  const [year, setYear] = useState(initialDate?.getFullYear() ?? today.getFullYear());
  const [month, setMonth] = useState(initialDate?.getMonth() ?? today.getMonth());
  const [day, setDay] = useState(initialDate?.getDate() ?? today.getDate());

  useEffect(() => {
    if (visible) {
      setYear(initialDate?.getFullYear() ?? today.getFullYear());
      setMonth(initialDate?.getMonth() ?? today.getMonth());
      setDay(initialDate?.getDate() ?? today.getDate());
    }
  }, [visible]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const safeDay = Math.min(day, daysInMonth);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={dp.overlay}>
        <View style={dp.sheet}>
          <Text style={dp.heading}>{title}</Text>

          {/* Month / Year navigation */}
          <View style={dp.navRow}>
            <TouchableOpacity onPress={prevMonth} style={dp.navBtn}>
              <Text style={dp.navTxt}>‹</Text>
            </TouchableOpacity>
            <Text style={dp.monthLabel}>{MONTHS[month]} {year}</Text>
            <TouchableOpacity onPress={nextMonth} style={dp.navBtn}>
              <Text style={dp.navTxt}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Day grid */}
          <View style={dp.grid}>
            {days.map((d) => (
              <TouchableOpacity
                key={d}
                style={[dp.dayCell, d === safeDay && dp.daySelected]}
                onPress={() => setDay(d)}
              >
                <Text style={[dp.dayTxt, d === safeDay && dp.dayTxtSelected]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Confirm / Cancel */}
          <View style={dp.actions}>
            <TouchableOpacity style={dp.cancelBtn} onPress={onCancel}>
              <Text style={dp.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={dp.confirmBtn}
              onPress={() => onConfirm(new Date(year, month, safeDay))}
            >
              <Text style={dp.confirmTxt}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const dp = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  heading: { fontSize: 18, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navBtn: { padding: 8 },
  navTxt: { fontSize: 28, color: "#f59e0b", fontWeight: "bold" },
  monthLabel: { fontSize: 17, fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 6, justifyContent: "center" },
  dayCell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
  },
  daySelected: { backgroundColor: "#f59e0b" },
  dayTxt: { fontSize: 14, color: "#1e293b" },
  dayTxtSelected: { color: "#fff", fontWeight: "700" },
  actions: { flexDirection: "row", gap: 12, marginTop: 20 },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
  },
  cancelTxt: { fontWeight: "600", color: "#64748b" },
  confirmBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#f59e0b",
    alignItems: "center",
  },
  confirmTxt: { fontWeight: "700", color: "#fff" },
});
// ─────────────────────────────────────────────────────────────────────────────

export default function AddOfferScreen() {
  const { userId } = useAuth();
  const [restaurants, setRestaurants] = useState<{ _id: string; title: string }[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [offer_type, setOfferType] = useState<"Flat Discount" | "Percentage Discount">("Flat Discount");
  const [discount_value, setDiscountValue] = useState("");
  const [min_order_value, setMinOrderValue] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [validFromDate, setValidFromDate] = useState<Date | null>(null);
  const [validToDate, setValidToDate] = useState<Date | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [activeDateField, setActiveDateField] = useState<"from" | "to" | null>(null);

  useEffect(() => {
    if (!userId) return;
    getRestaurantsByUserId(userId)
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        const list = Array.isArray(data) ? data : [];
        setRestaurants(list);
        if (list.length > 0) setSelectedRestaurantId(list[0]._id);
      })
      .catch(() => {});
  }, [userId]);

  const openPicker = (field: "from" | "to") => {
    setActiveDateField(field);
    setPickerVisible(true);
  };

  const onConfirmDate = (d: Date) => {
    if (activeDateField === "from") setValidFromDate(d);
    else setValidToDate(d);
    setPickerVisible(false);
    setActiveDateField(null);
  };

  const fmt = (d: Date | null) => {
    if (!d) return "Tap to select date";
    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
  };

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
      Alert.alert("Error", "Title and description required"); return;
    }
    if (!discount_value || isNaN(Number(discount_value))) {
      Alert.alert("Error", "Valid discount value required"); return;
    }
    if (!validFromDate || !validToDate) {
      Alert.alert("Error", "Please select valid from and to dates"); return;
    }
    if (validToDate <= validFromDate) {
      Alert.alert("Error", "Valid To must be after Valid From"); return;
    }
    if (!selectedRestaurantId) {
      Alert.alert("Error", "Select a restaurant"); return;
    }
    if (!imageUri) {
      Alert.alert("Error", "Select an image"); return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("offer_type", offer_type);
      formData.append("discount_value", discount_value);
      formData.append("valid_from", validFromDate.toISOString().split("T")[0]);
      formData.append("valid_to", validToDate.toISOString().split("T")[0]);
      formData.append("status", "Active");
      formData.append("requires_approval", "false");
      if (min_order_value) formData.append("min_order_value", min_order_value);
      formData.append("restaurant_ids", selectedRestaurantId);

      const filename = imageUri.split("/").pop() || "photo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";
      formData.append("image", { uri: imageUri, name: filename, type } as any);

      await addOffer(formData);
      Alert.alert("Success", "Offer added successfully!", [
        { text: "OK", onPress: () => router.replace("/(auth)/restaurant/my-offers") },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e.response?.data?.message || "Failed to add offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Restaurant selector */}
        <View style={styles.field}>
          <Text style={styles.label}>Restaurant *</Text>
          <View style={styles.chipRow}>
            {restaurants.map((r) => (
              <TouchableOpacity
                key={r._id}
                style={[styles.chip, selectedRestaurantId === r._id && styles.chipActive]}
                onPress={() => setSelectedRestaurantId(r._id)}
              >
                <Text style={[styles.chipText, selectedRestaurantId === r._id && styles.chipTextActive]}>
                  {r.title}
                </Text>
              </TouchableOpacity>
            ))}
            {restaurants.length === 0 && (
              <Text style={styles.emptyNote}>No restaurants found. Add one first.</Text>
            )}
          </View>
        </View>

        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Title *</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Offer title" />
        </View>

        {/* Description */}
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

        {/* Offer type */}
        <View style={styles.field}>
          <Text style={styles.label}>Offer Type</Text>
          <View style={styles.chipRow}>
            {(["Flat Discount", "Percentage Discount"] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.chip, offer_type === t && styles.chipActive]}
                onPress={() => setOfferType(t)}
              >
                <Text style={[styles.chipText, offer_type === t && styles.chipTextActive]}>
                  {t === "Flat Discount" ? "₹ Flat" : "% Percentage"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Discount value & Min order */}
        <View style={styles.row}>
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
          <View style={[styles.field, styles.half]}>
            <Text style={styles.label}>Min Order (₹)</Text>
            <TextInput
              style={styles.input}
              value={min_order_value}
              onChangeText={setMinOrderValue}
              placeholder="Optional"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Date pickers */}
        <View style={styles.row}>
          <View style={[styles.field, styles.half]}>
            <Text style={styles.label}>Valid From *</Text>
            <TouchableOpacity style={styles.dateBtn} onPress={() => openPicker("from")}>
              <Text style={[styles.dateTxt, !validFromDate && styles.datePlaceholder]}>
                {fmt(validFromDate)}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.field, styles.half]}>
            <Text style={styles.label}>Valid To *</Text>
            <TouchableOpacity style={styles.dateBtn} onPress={() => openPicker("to")}>
              <Text style={[styles.dateTxt, !validToDate && styles.datePlaceholder]}>
                {fmt(validToDate)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Image */}
        <View style={styles.field}>
          <Text style={styles.label}>Image *</Text>
          <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
            <Text style={styles.imageBtnText}>{imageUri ? "✓ Image Selected — Change" : "Select Image"}</Text>
          </TouchableOpacity>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.disabled]}
          onPress={submit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Add Offer</Text>}
        </TouchableOpacity>
      </ScrollView>

      {/* Custom date picker modal */}
      <DatePickerModal
        visible={pickerVisible}
        title={activeDateField === "from" ? "Select Valid From Date" : "Select Valid To Date"}
        initialDate={activeDateField === "from" ? validFromDate : validToDate}
        onConfirm={onConfirmDate}
        onCancel={() => { setPickerVisible(false); setActiveDateField(null); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20, paddingBottom: 60 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#1e293b" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#1e293b",
  },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
  },
  chipActive: { backgroundColor: "#f59e0b" },
  chipText: { fontSize: 14, color: "#475569" },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  dateBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  dateTxt: { fontSize: 14, color: "#1e293b", fontWeight: "500" },
  datePlaceholder: { color: "#94a3b8" },
  imageBtn: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  imageBtnText: { color: "#fff", fontWeight: "600" },
  submitBtn: {
    backgroundColor: "#f59e0b",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  disabled: { opacity: 0.6 },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  emptyNote: { color: "#94a3b8", fontSize: 13 },
});
