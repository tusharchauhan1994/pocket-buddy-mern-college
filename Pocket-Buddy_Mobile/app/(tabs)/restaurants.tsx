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
  Linking,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getRestaurants, getOffersByRestaurant } from "@/src/services/api";

type Restaurant = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  address?: string;
  contactNumber?: string;
  timings?: string;
  imageURL?: string;
  ownerName?: string;
  ownerContact?: string;
  active?: boolean;
};

type Offer = {
  _id: string;
  title: string;
  description?: string;
  offer_type?: string;
  discount_value?: number;
  valid_to?: string;
};

export default function RestaurantsScreen() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);

  const fetch = async () => {
    try {
      const res = await getRestaurants();
      const data = res.data?.data || res.data || [];
      const list: Restaurant[] = [];
      if (Array.isArray(data)) {
        data.forEach((owner: { restaurants?: Restaurant[]; name?: string; email?: string; contactNumber?: string }) => {
          if (owner.restaurants?.length) {
            owner.restaurants.forEach((r) => {
              list.push({
                ...r,
                ownerName: owner.name,
                ownerContact: owner.contactNumber,
              });
            });
          }
        });
      }
      setRestaurants(list);
    } catch {
      setRestaurants([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const openOffers = async (restaurant: Restaurant) => {
    setSelected(restaurant);
    setOffersLoading(true);
    try {
      const res = await getOffersByRestaurant(restaurant._id);
      const offersData = res.data?.offers ?? res.data ?? [];
      setOffers(Array.isArray(offersData) ? offersData : []);
    } catch {
      setOffers([]);
    } finally {
      setOffersLoading(false);
    }
  };

  const filtered = restaurants.filter(
    (r) =>
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: Restaurant }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.imageURL || "https://via.placeholder.com/400x200" }}
        style={styles.cardImage}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardMeta}>{item.ownerName || "—"}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description || "No description"}
        </Text>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.viewOffersBtn}
            onPress={() => openOffers(item)}
          >
            <Text style={styles.viewOffersText}>View Offers</Text>
          </TouchableOpacity>
          {item.address && (
            <TouchableOpacity
              style={styles.mapBtn}
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address!)}`
                )
              }
            >
              <Ionicons name="navigate" size={20} color="#3b82f6" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants..."
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
            <Text style={styles.empty}>No restaurants found</Text>
          }
        />
      )}

      <Modal
        visible={!!selected}
        transparent
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Offers at {selected?.title}
              </Text>
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Ionicons name="close" size={28} color="#64748b" />
              </TouchableOpacity>
            </View>
            {offersLoading ? (
              <ActivityIndicator color="#f59e0b" style={{ marginVertical: 32 }} />
            ) : offers.length === 0 ? (
              <Text style={styles.emptyModal}>No active offers</Text>
            ) : (
              <ScrollView style={styles.offersList}>
                {offers.map((o) => (
                  <View key={o._id} style={styles.offerCard}>
                    <Text style={styles.offerTitle}>{o.title}</Text>
                    <Text style={styles.offerDesc}>{o.description}</Text>
                    <Text style={styles.offerDiscount}>
                      {o.offer_type === "Percentage"
                        ? `${o.discount_value}% OFF`
                        : `₹${o.discount_value} OFF`}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  cardMeta: { fontSize: 14, color: "#64748b", marginBottom: 4 },
  cardDesc: { fontSize: 14, color: "#94a3b8", marginBottom: 12 },
  cardActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  viewOffersBtn: {
    flex: 1,
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  viewOffersText: { color: "#fff", fontWeight: "600" },
  mapBtn: { padding: 8 },
  empty: { textAlign: "center", color: "#64748b", marginTop: 32 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  offersList: { maxHeight: 400 },
  offerCard: {
    padding: 14,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    marginBottom: 12,
  },
  offerTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  offerDesc: { fontSize: 14, color: "#64748b", marginBottom: 6 },
  offerDiscount: { fontSize: 14, fontWeight: "600", color: "#16a34a" },
  emptyModal: { textAlign: "center", color: "#64748b", marginVertical: 24 },
});
