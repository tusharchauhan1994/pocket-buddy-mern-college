import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getOffers } from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";
import OfferSlider from "@/src/components/OfferSlider";
import RestaurantCard from "@/src/components/RestaurantCard";

type Offer = {
  _id: string;
  title: string;
  description?: string;
  offer_type?: string;
  discount_value?: number;
  valid_to?: string;
  imageURL?: string;
};

const CUISINES = ["Pizza", "Gujarati", "South Indian", "Chinese", "Burger", "Dessert"];

export default function Home() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const { isLoggedIn } = useAuth();

  const fetch = async () => {
    try {
      const res = await getOffers();
      const data = res.data?.offers ?? res.data;
      setOffers(Array.isArray(data) ? data : []);
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

  const onRefresh = () => {
    setRefreshing(true);
    fetch();
  };

  const filteredOffers = offers.filter(
    (o) =>
      o.title?.toLowerCase().includes(search.toLowerCase()) ||
      o.description?.toLowerCase().includes(search.toLowerCase())
  );

  const isSearching = search.trim() !== "";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Search Bar */}

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for restaurants, offers..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
          {isSearching && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#d32f2f" style={{ marginTop: 40 }} />
        ) : (
          <>
            {!isSearching && (
              <>
                {/* Cuisine Pills */}
                <View style={styles.cuisineSection}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cuisineScroll}>
                    {CUISINES.map((cuisine, index) => (
                      <TouchableOpacity 
                        key={index} 
                        style={styles.cuisinePill}
                        onPress={() => setSearch(cuisine)}
                      >
                        <Text style={styles.cuisineText}>{cuisine}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Offer Slider */}
                {offers.length > 0 && <OfferSlider offers={offers.slice(0, 5)} />}
              </>
            )}

            {/* Restaurant List */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {isSearching ? "Search Results" : "New Outlets"}
              </Text>
              {!isSearching && (
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.listContainer}>
              {isSearching ? (
                filteredOffers.length > 0 ? (
                  filteredOffers.map((offer) => (
                    <RestaurantCard key={offer._id} offer={offer} />
                  ))
                ) : (
                  <Text style={styles.emptySearchText}>No results found for "{search}"</Text>
                )
              ) : offers.slice(5).length > 0 ? (
                offers.slice(5).map((offer) => (
                  <RestaurantCard key={offer._id} offer={offer} />
                ))
              ) : (
                offers.slice(0, 5).map((offer) => (
                  <RestaurantCard key={offer._id} offer={offer} />
                ))
              )}
            </View>
          </>
        )}

        {!isLoggedIn && (
          <TouchableOpacity style={styles.loginPrompt} onPress={() => router.push("/login")}>
            <Text style={styles.loginPromptText}>Login to access all features</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { paddingBottom: 40 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: "#1e293b" },
  cuisineSection: { paddingVertical: 12, backgroundColor: "#ffffff" },
  cuisineScroll: { paddingHorizontal: 16, gap: 10 },
  cuisinePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cuisineText: { color: "#475569", fontWeight: "500", fontSize: 14 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  viewAllText: {
    color: "#d32f2f",
    fontWeight: "600",
    fontSize: 14,
  },
  listContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  loginPrompt: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    alignItems: "center",
  },
  loginPromptText: { color: "#d32f2f", fontWeight: "bold" },
  emptySearchText: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 15,
    marginTop: 40,
  },
});
