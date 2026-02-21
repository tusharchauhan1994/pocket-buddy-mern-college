import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getAllSubscriptions, deleteSubscription } from "@/src/services/api";

type Sub = {
  _id: string;
  planName?: string;
  amount?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  userId?: { name?: string; email?: string };
};

export default function AdminSubscriptionsScreen() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    getAllSubscriptions()
      .then((res) => {
        const data = res.data?.subscriptions ?? res.data ?? [];
        setSubs(Array.isArray(data) ? data : []);
      })
      .catch(() => setSubs([]))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert("Delete Subscription", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteSubscription(id);
            setSubs((prev) => prev.filter((s) => s._id !== id));
            Alert.alert("Success", "Deleted");
          } catch {
            Alert.alert("Error", "Failed to delete");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Sub }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.plan}>{item.planName || "—"}</Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: item.status === "active" ? "#dcfce7" : "#fee2e2" },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: item.status === "active" ? "#16a34a" : "#dc2626" },
            ]}
          >
            {item.status || "—"}
          </Text>
        </View>
      </View>
      <Text style={styles.user}>
        {item.userId?.name || item.userId?.email || "—"}
      </Text>
      <Text style={styles.amount}>₹{item.amount ?? "—"}</Text>
      <Text style={styles.date}>
        {item.startDate ? new Date(item.startDate).toLocaleDateString() : ""}
        {item.endDate
          ? ` – ${new Date(item.endDate).toLocaleDateString()}`
          : ""}
      </Text>
      <TouchableOpacity
        style={styles.delBtn}
        onPress={() => handleDelete(item._id)}
      >
        <Text style={styles.delBtnText}>Delete</Text>
      </TouchableOpacity>
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
    <FlatList
      data={subs}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
      }
      ListEmptyComponent={<Text style={styles.empty}>No subscriptions</Text>}
    />
  );
}

const styles = StyleSheet.create({
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  plan: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontSize: 12, fontWeight: "600" },
  user: { fontSize: 14, color: "#64748b", marginBottom: 4 },
  amount: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  date: { fontSize: 12, color: "#94a3b8", marginBottom: 8 },
  delBtn: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#fee2e2",
    borderRadius: 8,
  },
  delBtnText: { color: "#dc2626", fontWeight: "600", fontSize: 13 },
  empty: { textAlign: "center", color: "#64748b", marginTop: 32 },
});
