import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { getOffers, getSubscriptionByUser } from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";

export default function UserDashboard() {
  const { userId, logout } = useAuth();
  const [offersCount, setOffersCount] = useState(0);
  const [subscription, setSubscription] = useState<{ planName?: string; status?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = async () => {
    if (!userId) return;
    try {
      const [offersRes, subRes] = await Promise.all([
        getOffers(),
        getSubscriptionByUser(userId),
      ]);
      const offersData = offersRes.data?.offers ?? offersRes.data ?? [];
      setOffersCount(Array.isArray(offersData) ? offersData.length : 0);
      const subData = subRes.data?.subscription ?? subRes.data;
      setSubscription(subData || null);
    } catch {
      setOffersCount(0);
      setSubscription(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetch();
  };

  useEffect(() => {
    fetch();
  }, [userId]);

  const handleLogout = async () => {
    await logout();
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.cards}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(tabs)/user/offers")}
        >
          <Text style={styles.cardValue}>{offersCount}</Text>
          <Text style={styles.cardLabel}>Available Offers</Text>
        </TouchableOpacity>
        <View style={styles.card}>
          <Text style={styles.cardValue}>
            {subscription?.planName || "—"}
          </Text>
          <Text style={styles.cardLabel}>Subscription</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/(tabs)/user/profile")}
        >
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/(tabs)/user/offers")}
        >
          <Text style={styles.menuText}>Browse Offers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/(tabs)/user/restaurants")}
        >
          <Text style={styles.menuText}>Restaurants</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/(tabs)/user/requests")}
        >
          <Text style={styles.menuText}>My Redemption Requests</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8fafc" },
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  cards: { flexDirection: "row", gap: 12, marginBottom: 24 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  menuText: { fontSize: 16 },
  logoutBtn: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: { color: "#dc2626", fontWeight: "600" },
});
