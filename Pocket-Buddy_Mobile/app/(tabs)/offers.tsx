import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getOffers } from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";

type Offer = {
  _id: string;
  title: string;
  description?: string;
  offer_type?: string;
  discount_value?: number;
  valid_to?: string;
  imageURL?: string;
};

const formatDiscount = (offer: Offer) => {
  if (offer.offer_type === "Flat Discount") return `₹${offer.discount_value} OFF`;
  if (offer.offer_type === "Percentage") return `${offer.discount_value}% OFF`;
  return offer.offer_type || "Offer";
};

export default function OffersScreen() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const { isLoggedIn } = useAuth();

  const fetch = async () => {
    try {
      const res = await getOffers();
      let offersData = Array.isArray(res.data)
        ? res.data
        : res.data?.offers || [];
      const validOffers = offersData.filter(
        (offer: any) => offer._id && offer.title && offer.description
      );
      setOffers(validOffers);
    } catch {
      setOffers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const filtered = offers.filter(
    (o) =>
      o.title?.toLowerCase().includes(search.toLowerCase()) ||
      o.description?.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: Offer }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/offer/${item._id}`)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imageURL || "https://via.placeholder.com/300" }}
        style={styles.cardImage}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description || ""}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.discount}>{formatDiscount(item)}</Text>
          <Text style={styles.date}>
            {item.valid_to ? new Date(item.valid_to).toLocaleDateString() : ""}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.claimBtn}
          onPress={() =>
            isLoggedIn ? router.push(`/offer/${item._id}`) : router.push("/login")
          }
        >
          <Text style={styles.claimBtnText}>
            {isLoggedIn ? "View & Redeem" : "Sign Up to Claim"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search offers..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#f59e0b" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetch} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              {search ? "No offers match your search" : "No offers available"}
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
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
  cardImage: { width: "100%", height: 140 },
  cardBody: { padding: 14 },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  cardDesc: { fontSize: 14, color: "#64748b", marginBottom: 8 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  discount: { fontSize: 16, fontWeight: "bold", color: "#dc2626" },
  date: { fontSize: 12, color: "#94a3b8" },
  claimBtn: {
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  claimBtnText: { color: "#fff", fontWeight: "600" },
  empty: { textAlign: "center", color: "#64748b", marginTop: 32 },
});
