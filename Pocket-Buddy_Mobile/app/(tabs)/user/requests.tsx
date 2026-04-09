import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { getRedeemsByUser } from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";

type Redeem = {
  _id: string;
  status?: string;
  offer_id?: { title?: string };
  restaurant_id?: { title?: string };
  redeemTime?: string;
};

export default function UserRequests() {
  const { userId } = useAuth();
  const [redeems, setRedeems] = useState<Redeem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    if (!userId) return;
    getRedeemsByUser(userId)
      .then((res) => {
        const data = res.data?.redeems ?? res.data ?? [];
        setRedeems(Array.isArray(data) ? data : []);
      })
      .catch(() => setRedeems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch();
  }, [userId]);

  const getStatusColor = (s: string) => {
    if (s === "Approved" || s === "Used") return "#16a34a";
    if (s === "Rejected") return "#dc2626";
    return "#f59e0b";
  };

  const renderItem = ({ item }: { item: Redeem }) => {
    const offer = item.offer_id;
    const restaurant = item.restaurant_id;
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {offer?.title || "Offer"}
        </Text>
        <Text style={styles.cardMeta}>
          {restaurant?.title || "Restaurant"}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status || "Pending") + "20" },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.status || "Pending") },
            ]}
          >
            {item.status || "Pending"}
          </Text>
        </View>
        {item.redeemTime && (
          <Text style={styles.date}>
            {new Date(item.redeemTime).toLocaleString()}
          </Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f59e0b" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={redeems}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetch} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No redemption requests</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  cardMeta: { fontSize: 14, color: "#64748b", marginBottom: 8 },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 12, fontWeight: "600" },
  date: { fontSize: 12, color: "#94a3b8", marginTop: 8 },
  empty: { textAlign: "center", color: "#64748b", marginTop: 32 },
});
