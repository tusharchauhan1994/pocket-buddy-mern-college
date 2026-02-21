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
import { getOffers } from "@/src/services/api";

type Offer = {
  _id: string;
  title: string;
  description?: string;
  offer_type?: string;
  discount_value?: number;
  valid_to?: string;
  status?: string;
  imageURL?: string;
};

export default function AdminOffersScreen() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    getOffers()
      .then((res) => {
        const data = res.data?.offers ?? res.data ?? [];
        setOffers(Array.isArray(data) ? data : []);
      })
      .catch(() => setOffers([]))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDiscount = (o: Offer) => {
    if (o.offer_type === "Flat Discount") return `₹${o.discount_value} OFF`;
    if (o.offer_type === "Percentage" || o.offer_type === "Percentage Discount")
      return `${o.discount_value}% OFF`;
    return `${o.discount_value}`;
  };

  const renderItem = ({ item }: { item: Offer }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.imageURL || "https://via.placeholder.com/100" }}
        style={styles.image}
      />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.discount}>{formatDiscount(item)}</Text>
        <Text style={styles.date}>
          Valid until: {item.valid_to ? new Date(item.valid_to).toLocaleDateString() : "—"}
        </Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: item.status === "Active" ? "#dcfce7" : "#fee2e2" },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: item.status === "Active" ? "#16a34a" : "#dc2626" },
            ]}
          >
            {item.status || "Active"}
          </Text>
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
    <FlatList
      data={offers}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
      }
      ListEmptyComponent={<Text style={styles.empty}>No offers</Text>}
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
  discount: { fontSize: 14, color: "#dc2626", fontWeight: "600" },
  date: { fontSize: 12, color: "#64748b", marginTop: 4 },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  badgeText: { fontSize: 12, fontWeight: "600" },
  empty: { textAlign: "center", color: "#64748b", marginTop: 32 },
});
