import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import {
  getRestaurantsByUserId,
  getOffersByRestaurant,
  deleteOffer,
  updateOffer,
} from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

type Offer = {
  _id: string;
  title: string;
  description?: string;
  offer_type?: string;
  discount_value?: number;
  valid_from?: string;
  valid_to?: string;
  status?: string;
  imageURL?: string;
};

export default function MyOffersScreen() {
  const { userId } = useAuth();
  const [restaurants, setRestaurants] = useState<{ _id: string; title: string }[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getRestaurantsByUserId(userId)
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        const list = Array.isArray(data) ? data : [];
        setRestaurants(list);
        if (list.length > 0 && !selectedRestaurantId) {
          setSelectedRestaurantId(list[0]._id);
        }
      })
      .catch(() => setRestaurants([]));
  }, [userId]);

  useEffect(() => {
    if (!selectedRestaurantId) return;
    setLoading(true);
    getOffersByRestaurant(selectedRestaurantId)
      .then((res) => {
        const data = res.data?.offers ?? res.data ?? [];
        setOffers(Array.isArray(data) ? data : []);
      })
      .catch(() => setOffers([]))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, [selectedRestaurantId]);

  const onRefresh = () => {
    setRefreshing(true);
    if (selectedRestaurantId) {
      getOffersByRestaurant(selectedRestaurantId)
        .then((res) => {
          const data = res.data?.offers ?? res.data ?? [];
          setOffers(Array.isArray(data) ? data : []);
        })
        .finally(() => setRefreshing(false));
    } else setRefreshing(false);
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      "Delete Offer",
      `Delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteOffer(id);
              setOffers((prev) => prev.filter((o) => o._id !== id));
              Alert.alert("Success", "Offer deleted");
            } catch {
              Alert.alert("Error", "Failed to delete");
            }
          },
        },
      ]
    );
  };

  const handleToggleStatus = async (offer: Offer) => {
    const newStatus = offer.status === "Active" ? "Inactive" : "Active";
    try {
      await updateOffer(offer._id, { ...offer, status: newStatus });
      setOffers((prev) =>
        prev.map((o) => (o._id === offer._id ? { ...o, status: newStatus } : o))
      );
    } catch {
      Alert.alert("Error", "Failed to update");
    }
  };

  const formatDiscount = (o: Offer) => {
    if (o.offer_type === "Flat Discount" || o.offer_type === "Percentage Discount")
      return `${o.discount_value}% OFF`;
    return `₹${o.discount_value} OFF`;
  };

  const renderItem = ({ item }: { item: Offer }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.imageURL || "https://via.placeholder.com/300" }}
        style={styles.image}
      />
      <View style={styles.body}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.discount}>{formatDiscount(item)}</Text>
        <Text style={styles.date}>
          {item.valid_to
            ? new Date(item.valid_to).toLocaleDateString()
            : ""}
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === "Active" ? "#dcfce7" : "#fee2e2",
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: item.status === "Active" ? "#16a34a" : "#dc2626" },
            ]}
          >
            {item.status || "Active"}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => handleToggleStatus(item)}
          >
            <Text style={styles.toggleText}>
              {item.status === "Active" ? "Deactivate" : "Activate"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.delBtn}
            onPress={() => handleDelete(item._id, item.title)}
          >
            <Ionicons name="trash-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {restaurants.length > 0 && (
        <View style={styles.addOfferBar}>
          <TouchableOpacity
            style={styles.addOfferBtn}
            onPress={() => router.push("/(auth)/restaurant/add-offer")}
          >
            <Text style={styles.addOfferBtnText}>+ Add Offer</Text>
          </TouchableOpacity>
        </View>
      )}
      {restaurants.length > 1 && (
        <View style={styles.picker}>
          <Text style={styles.pickerLabel}>Restaurant</Text>
          <View style={styles.pickerRow}>
            {restaurants.map((r) => (
              <TouchableOpacity
                key={r._id}
                style={[
                  styles.pickerBtn,
                  selectedRestaurantId === r._id && styles.pickerBtnActive,
                ]}
                onPress={() => setSelectedRestaurantId(r._id)}
              >
                <Text
                  style={[
                    styles.pickerText,
                    selectedRestaurantId === r._id && styles.pickerTextActive,
                  ]}
                >
                  {r.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {restaurants.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Add a restaurant first</Text>
        </View>
      ) : loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f59e0b" />
        </View>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No offers for this restaurant</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  addOfferBar: { padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  addOfferBtn: {
    backgroundColor: "#f59e0b",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  addOfferBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  picker: { padding: 16, paddingTop: 0, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  pickerLabel: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  pickerRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pickerBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#e2e8f0",
  },
  pickerBtnActive: { backgroundColor: "#f59e0b" },
  pickerText: { fontSize: 14 },
  pickerTextActive: { color: "#fff", fontWeight: "600" },
  list: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: { width: "100%", height: 100 },
  body: { padding: 14 },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  discount: { fontSize: 14, color: "#dc2626", fontWeight: "600" },
  date: { fontSize: 12, color: "#64748b", marginTop: 4 },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  statusText: { fontSize: 12, fontWeight: "600" },
  actions: { flexDirection: "row", gap: 12, marginTop: 12 },
  toggleBtn: {
    flex: 1,
    backgroundColor: "#3b82f6",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  toggleText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  delBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#dc2626",
    borderRadius: 8,
    justifyContent: "center",
  },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#64748b" },
});
