import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { router } from "expo-router";
import {
  getRestaurantsByUserId,
  getOffersByRestaurant,
  getRedeemsByOwner,
} from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";

export default function RestaurantDashboard() {
  const { userId, role, logout } = useAuth();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [offersCount, setOffersCount] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (role !== "Restaurant") {
      Alert.alert("Access Denied", "Restaurant owners only", [
        { text: "OK", onPress: () => router.replace("/(tabs)") },
      ]);
      return;
    }
    fetchData();
  }, [userId, role, selectedId]);

  const fetchData = async () => {
    if (!userId) return;
    try {
      const locRes = await getRestaurantsByUserId(userId);
      const locations = locRes.data?.data ?? locRes.data ?? [];
      const list = Array.isArray(locations) ? locations : [locations];
      setRestaurants(list);
      if (list.length > 0 && !selectedId) setSelectedId(list[0]._id);

      const rid = selectedId || list[0]?._id;
      if (rid) {
        const [offersRes, redeemsRes] = await Promise.all([
          getOffersByRestaurant(rid),
          getRedeemsByOwner(userId),
        ]);
        const offers = offersRes.data?.offers ?? offersRes.data ?? [];
        setOffersCount(Array.isArray(offers) ? offers.length : 0);
        const redeems = redeemsRes.data ?? [];
        const arr = Array.isArray(redeems) ? redeems : [];
        const pending = arr.filter((r: any) => r.status === "Pending").length;
        setPendingRequests(pending);
      } else {
        setOffersCount(0);
        setPendingRequests(0);
      }
    } catch {
      setRestaurants([]);
      setOffersCount(0);
      setPendingRequests(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(tabs)");
  };

  const selected = restaurants.find((r) => r._id === selectedId);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Restaurant Dashboard</Text>

      {restaurants.length > 1 && (
        <View style={styles.pickerRow}>
          <Text style={styles.label}>Select Restaurant</Text>
          <View style={styles.pickerWrap}>
            {restaurants.map((r) => (
              <TouchableOpacity
                key={r._id}
                style={[styles.pickerBtn, selectedId === r._id && styles.pickerBtnActive]}
                onPress={() => setSelectedId(r._id)}
              >
                <Text
                  style={[
                    styles.pickerText,
                    selectedId === r._id && styles.pickerTextActive,
                  ]}
                >
                  {r.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <Text style={styles.subtitle}>{selected?.title || "No restaurant"}</Text>

      <View style={styles.cards}>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{restaurants.length}</Text>
          <Text style={styles.cardLabel}>Restaurants</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{offersCount}</Text>
          <Text style={styles.cardLabel}>Offers</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{pendingRequests}</Text>
          <Text style={styles.cardLabel}>Pending</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/(auth)/restaurant/my-restaurant")}
        >
          <Text style={styles.menuText}>My Restaurants</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/(auth)/restaurant/add-restaurant")}
        >
          <Text style={styles.menuText}>Add Restaurant</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/(auth)/restaurant/my-offers")}
        >
          <Text style={styles.menuText}>My Offers</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/(auth)/restaurant/manage-requests")}
        >
          <Text style={styles.menuText}>Manage Requests</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#64748b", marginBottom: 20 },
  pickerRow: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 8 },
  pickerWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pickerBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#e2e8f0",
  },
  pickerBtnActive: { backgroundColor: "#f59e0b" },
  pickerText: { fontSize: 14 },
  pickerTextActive: { color: "#fff", fontWeight: "600" },
  cards: { flexDirection: "row", gap: 12, marginBottom: 24 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardValue: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  cardLabel: { fontSize: 12, color: "#64748b" },
  menu: { backgroundColor: "#fff", borderRadius: 12, overflow: "hidden" },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  menuText: { fontSize: 16 },
  menuArrow: { fontSize: 20, color: "#94a3b8" },
  logoutBtn: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: { color: "#dc2626", fontWeight: "600" },
});
