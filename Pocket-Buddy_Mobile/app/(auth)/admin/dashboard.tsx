import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import {
  getAllUsers,
  getRestaurants,
  getOffers,
  getAllSubscriptions,
} from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";

export default function AdminDashboard() {
  const { role, logout } = useAuth();
  const [usersCount, setUsersCount] = useState(0);
  const [restaurantsCount, setRestaurantsCount] = useState(0);
  const [offersCount, setOffersCount] = useState(0);
  const [subscriptionsCount, setSubscriptionsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (role !== "Admin") {
      Alert.alert("Access Denied", "Admin only", [
        { text: "OK", onPress: () => router.replace("/(tabs)") },
      ]);
      return;
    }
    fetchData();
  }, [role]);

  const fetchData = async () => {
    try {
      const [usersRes, restRes, offersRes, subRes] = await Promise.all([
        getAllUsers(),
        getRestaurants(),
        getOffers(),
        getAllSubscriptions(),
      ]);
      const users = usersRes.data?.data ?? usersRes.data ?? [];
      setUsersCount(Array.isArray(users) ? users.length : 0);
      const restaurants = restRes.data?.data ?? restRes.data ?? [];
      let restCount = 0;
      if (Array.isArray(restaurants)) {
        restaurants.forEach(
          (r: { restaurants?: unknown[] }) =>
            (restCount += r.restaurants?.length ?? 0)
        );
      }
      setRestaurantsCount(restCount);
      const offers = offersRes.data?.offers ?? offersRes.data ?? [];
      setOffersCount(Array.isArray(offers) ? offers.length : 0);
      const subs = subRes.data?.subscriptions ?? subRes.data ?? [];
      setSubscriptionsCount(Array.isArray(subs) ? subs.length : 0);
    } catch {
      setUsersCount(0);
      setRestaurantsCount(0);
      setOffersCount(0);
      setSubscriptionsCount(0);
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

  const menu = [
    { key: "users", label: "Manage Users", count: usersCount },
    { key: "restaurants", label: "Manage Restaurants", count: restaurantsCount },
    { key: "offers", label: "Manage Offers", count: offersCount },
    { key: "subscriptions", label: "Subscriptions", count: subscriptionsCount },
  ];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Admin Dashboard</Text>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{usersCount}</Text>
          <Text style={styles.cardLabel}>Users</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{restaurantsCount}</Text>
          <Text style={styles.cardLabel}>Restaurants</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{offersCount}</Text>
          <Text style={styles.cardLabel}>Offers</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{subscriptionsCount}</Text>
          <Text style={styles.cardLabel}>Subscriptions</Text>
        </View>
      </View>

      <View style={styles.menu}>
        {menu.map((m) => (
          <TouchableOpacity
            key={m.key}
            style={styles.menuItem}
            onPress={() => router.push(`/(auth)/admin/${m.key}`)}
          >
            <Text style={styles.menuText}>{m.label}</Text>
            <Text style={styles.menuCount}>{m.count}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardValue: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  cardLabel: { fontSize: 12, color: "#64748b" },
  menu: { backgroundColor: "#fff", borderRadius: 12, overflow: "hidden" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  menuText: { flex: 1, fontSize: 16 },
  menuCount: { fontSize: 14, color: "#64748b", marginRight: 8 },
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
