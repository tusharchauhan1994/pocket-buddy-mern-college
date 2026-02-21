import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { getOffers } from "@/src/services/api";

type Offer = {
  _id: string;
  title: string;
  description?: string;
  offer_type?: string;
  discount_value?: number;
  valid_to?: string;
  imageURL?: string;
};

const formatDiscount = (o: Offer) => {
  if (o.offer_type === "Flat Discount") return `₹${o.discount_value} OFF`;
  if (o.offer_type === "Percentage") return `${o.discount_value}% OFF`;
  return o.offer_type || "Offer";
};

export default function UserOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOffers()
      .then((res) => {
        const data = res.data?.offers ?? res.data ?? [];
        setOffers(Array.isArray(data) ? data : []);
      })
      .catch(() => setOffers([]))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item }: { item: Offer }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/offer/${item._id}`)}
    >
      <Image
        source={{ uri: item.imageURL || "https://via.placeholder.com/300" }}
        style={styles.cardImage}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.discount}>{formatDiscount(item)}</Text>
        <TouchableOpacity
          style={styles.redeemBtn}
          onPress={() => router.push(`/offer/${item._id}`)}
        >
          <Text style={styles.redeemBtnText}>Redeem</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
      ListEmptyComponent={<Text style={styles.empty}>No offers</Text>}
    />
  );
}

const styles = StyleSheet.create({
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
  cardImage: { width: "100%", height: 120 },
  cardBody: { padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  discount: { fontSize: 14, color: "#dc2626", fontWeight: "600", marginBottom: 8 },
  redeemBtn: {
    backgroundColor: "#3b82f6",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  redeemBtnText: { color: "#fff", fontWeight: "600" },
  empty: { textAlign: "center", color: "#64748b", marginTop: 32 },
});
