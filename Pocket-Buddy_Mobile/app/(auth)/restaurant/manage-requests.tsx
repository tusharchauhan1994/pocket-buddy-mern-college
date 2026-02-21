import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getRedeemsByOwner, updateRedeemStatus } from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";

type Request = {
  _id: string;
  status: string;
  createdAt?: string;
  user_id?: { firstName?: string; lastName?: string; email?: string };
  offer_id?: { title?: string; description?: string };
};

export default function ManageRequestsScreen() {
  const { userId } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    if (!userId) return;
    getRedeemsByOwner(userId)
      .then((res) => {
        const data = res.data ?? [];
        setRequests(Array.isArray(data) ? data : []);
      })
      .catch(() => setRequests([]))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleAction = async (requestId: string, status: "Approved" | "Rejected") => {
    try {
      await updateRedeemStatus(requestId, status);
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status } : r))
      );
    } catch {
      // silent fail or toast
    }
  };

  const filtered = requests.filter((r) => {
    const matchFilter = r.status === filter;
    const matchSearch =
      !search ||
      (r.user_id?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        r.user_id?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        r.offer_id?.title?.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  const getStatusColor = (s: string) => {
    if (s === "Approved") return "#16a34a";
    if (s === "Rejected") return "#dc2626";
    return "#f59e0b";
  };

  const renderItem = ({ item }: { item: Request }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.userName}>
          {item.user_id?.firstName} {item.user_id?.lastName}
        </Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: getStatusColor(item.status) + "20" },
          ]}
        >
          <Text style={[styles.badgeText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text style={styles.email}>{item.user_id?.email}</Text>
      <Text style={styles.offerTitle}>{item.offer_id?.title}</Text>
      <Text style={styles.date}>
        {item.createdAt
          ? new Date(item.createdAt).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })
          : ""}
      </Text>
      {filter === "Pending" && item.status === "Pending" && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() => handleAction(item._id, "Approved")}
          >
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={styles.actionText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => handleAction(item._id, "Rejected")}
          >
            <Ionicons name="close" size={18} color="#fff" />
            <Text style={styles.actionText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <TextInput
          style={styles.search}
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.filterRow}>
          {(["Pending", "Approved", "Rejected"] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f59e0b" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No requests found</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  filters: { padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  search: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  filterRow: { flexDirection: "row", gap: 8 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#e2e8f0",
  },
  filterBtnActive: { backgroundColor: "#3b82f6" },
  filterText: { fontSize: 14 },
  filterTextActive: { color: "#fff", fontWeight: "600" },
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: { fontSize: 16, fontWeight: "600" },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontSize: 12, fontWeight: "600" },
  email: { fontSize: 13, color: "#64748b", marginTop: 4 },
  offerTitle: { fontSize: 14, fontWeight: "500", marginTop: 8 },
  date: { fontSize: 12, color: "#94a3b8", marginTop: 6 },
  actions: { flexDirection: "row", gap: 12, marginTop: 12 },
  approveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#16a34a",
    paddingVertical: 10,
    borderRadius: 8,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#dc2626",
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionText: { color: "#fff", fontWeight: "600" },
  empty: { textAlign: "center", color: "#64748b", marginTop: 32 },
});
