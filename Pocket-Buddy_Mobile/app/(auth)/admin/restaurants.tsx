import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { getRestaurants } from "@/src/services/api";

type Owner = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  restaurants?: { _id: string; title: string; contactNumber?: string; address?: string; imageURL?: string }[];
};

export default function AdminRestaurantsScreen() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    getRestaurants()
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        setOwners(Array.isArray(data) ? data : []);
      })
      .catch(() => setOwners([]))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const allRestaurants: { owner: Owner; rest: Owner["restaurants"][0] }[] = [];
  owners.forEach((o) => {
    o.restaurants?.forEach((r) => allRestaurants.push({ owner: o, rest: r }));
  });

  const renderItem = ({
    item,
  }: {
    item: { owner: Owner; rest: Owner["restaurants"][0] };
  }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: item.rest.imageURL || "https://via.placeholder.com/100",
        }}
        style={styles.image}
      />
      <View style={styles.body}>
        <Text style={styles.title}>{item.rest.title}</Text>
        <Text style={styles.owner}>
          Owner: {item.owner.firstName} {item.owner.lastName}
        </Text>
        <Text style={styles.info} numberOfLines={1}>
          {item.rest.contactNumber || ""} • {item.rest.address || ""}
        </Text>
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
      data={allRestaurants}
      keyExtractor={(item) => item.rest._id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
      }
      ListEmptyComponent={<Text style={styles.empty}>No restaurants</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  image: { width: 80, height: 80 },
  body: { flex: 1, padding: 14, justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  owner: { fontSize: 13, color: "#64748b", marginBottom: 4 },
  info: { fontSize: 12, color: "#94a3b8" },
  empty: { textAlign: "center", color: "#64748b", marginTop: 32 },
});
