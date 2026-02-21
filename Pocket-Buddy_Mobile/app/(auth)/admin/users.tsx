import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { getAllUsers } from "@/src/services/api";

type User = {
  _id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  status?: string;
};

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    getAllUsers()
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        const list = Array.isArray(data)
          ? data.map((u: any) => ({
              ...u,
              name:
                u.name ||
                `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
                u.email,
              role: u.roleId?.name ?? u.role ?? "—",
            }))
          : [];
        setUsers(list);
      })
      .catch(() => setUsers([]))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name || item.email}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <View
        style={[
          styles.roleBadge,
          {
            backgroundColor:
              item.role === "Admin" ? "#dcfce7" : item.role === "Restaurant" ? "#dbeafe" : "#fef3c7",
          },
        ]}
      >
        <Text style={styles.roleText}>{item.role}</Text>
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
    <FlatList
      data={users}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
      }
      ListEmptyComponent={<Text style={styles.empty}>No users</Text>}
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
  name: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  email: { fontSize: 14, color: "#64748b", marginBottom: 8 },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleText: { fontSize: 12, fontWeight: "600" },
  empty: { textAlign: "center", color: "#64748b", marginTop: 32 },
});
