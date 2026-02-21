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
  deleteRestaurant,
} from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

type Restaurant = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  timings?: string;
  contactNumber?: string;
  address?: string;
  imageURL?: string;
};

export default function MyRestaurantScreen() {
  const { userId } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!userId) return;
    getRestaurantsByUserId(userId)
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        setRestaurants(Array.isArray(data) ? data : []);
      })
      .catch(() => setRestaurants([]))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      "Delete Restaurant",
      `Are you sure you want to delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRestaurant(id);
              setRestaurants((prev) => prev.filter((r) => r._id !== id));
              Alert.alert("Success", "Restaurant deleted");
            } catch {
              Alert.alert("Error", "Failed to delete restaurant");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Restaurant }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.imageURL || "https://via.placeholder.com/300" }}
        style={styles.image}
      />
      <View style={styles.body}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>{item.category}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {item.description || ""}
        </Text>
        <Text style={styles.info}>📞 {item.contactNumber}</Text>
        <Text style={styles.info}>🕐 {item.timings}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              router.push(`/(auth)/restaurant/add-restaurant?editId=${item._id}`)
            }
          >
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.delBtn}
            onPress={() => handleDelete(item._id, item.title)}
          >
            <Ionicons name="trash-outline" size={18} color="#fff" />
            <Text style={styles.delBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No restaurants yet</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => router.push("/(auth)/restaurant/add-restaurant")}
            >
              <Text style={styles.addBtnText}>Add Restaurant</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  image: { width: "100%", height: 140 },
  body: { padding: 14 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  meta: { fontSize: 14, color: "#64748b", marginBottom: 4 },
  desc: { fontSize: 14, color: "#94a3b8", marginBottom: 8 },
  info: { fontSize: 13, color: "#64748b", marginBottom: 2 },
  actions: { flexDirection: "row", gap: 12, marginTop: 12 },
  editBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    borderRadius: 8,
  },
  editBtnText: { color: "#fff", fontWeight: "600" },
  delBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#dc2626",
    paddingVertical: 10,
    borderRadius: 8,
  },
  delBtnText: { color: "#fff", fontWeight: "600" },
  empty: { alignItems: "center", marginTop: 48 },
  emptyText: { fontSize: 16, color: "#64748b", marginBottom: 16 },
  addBtn: {
    backgroundColor: "#f59e0b",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addBtnText: { color: "#fff", fontWeight: "600" },
});
