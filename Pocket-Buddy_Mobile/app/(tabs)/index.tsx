import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { getOffers } from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";
import { Feather, FontAwesome } from "@expo/vector-icons";

type Offer = {
  _id: string;
  title: string;
  description?: string;
  offer_type?: string;
  discount_value?: number;
  valid_to?: string;
  imageURL?: string;
};

export default function Home() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const cuisines = ["PIZZA", "GUJARATI", "SOUTH INDIAN", "NORTH INDIAN"];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for restaurant cusines"
            placeholderTextColor="#999"
          />
        </View>

        {/* Cuisines Filter */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cuisinesList}
          >
            {cuisines.map((cuisine) => (
              <TouchableOpacity key={cuisine} style={styles.cuisinePill}>
                <Text style={styles.cuisineText}>{cuisine}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Promotional Banner Mock */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerWrapper}>
            <Image 
              source={{ uri: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80" }}
              style={styles.bannerImage}
            />
            {/* Overlay Banner Elements */}
            <View style={styles.bannerOverlay}>
              <View style={styles.bannerBadge}>
                <Text style={styles.bannerBadgeText}>PIZZA</Text>
              </View>
              <View style={styles.bannerRedBox}>
                <Text style={styles.bannerTitle}>UNLIMITED MEAL</Text>
                <Text style={styles.bannerTitle}>OFFER JUST</Text>
                <Text style={styles.bannerPrice}>₹ 199/-</Text>
              </View>
            </View>
            <View style={styles.dotsRow}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </View>

        {/* New Outlets Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>New Outlets</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/offers")}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#d32f2f" style={{ marginTop: 24 }} />
        ) : offers.length === 0 ? (
          <Text style={styles.empty}>No outlets available</Text>
        ) : (
          <View style={styles.grid}>
            {offers.slice(0, 6).map((offer, index) => (
              <TouchableOpacity
                key={offer._id || index}
                style={styles.card}
                onPress={() => router.push(`/offer/${offer._id}`)}
                activeOpacity={0.8}
              >
                <View style={styles.cardLeft}>
                  <Image
                    source={{
                      uri: offer.imageURL || "https://via.placeholder.com/150",
                    }}
                    style={styles.cardLogo}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.outletName} numberOfLines={1}>
                    {offer.title.toUpperCase()}
                  </Text>
                  <Text style={styles.outletAddress} numberOfLines={2}>
                    {offer.description || "Location details not available"}
                  </Text>
                  
                  <View style={styles.starsWrapper}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FontAwesome key={s} name="star" size={14} color="#d32f2f" style={styles.starIcon} />
                    ))}
                  </View>

                  <View style={styles.distanceWrapper}>
                    <FontAwesome name="map-marker" size={16} color="#d32f2f" style={styles.pinIcon} />
                    <Text style={styles.distanceText}>
                      {(Math.random() * 20).toFixed(1)} km away
                    </Text>
                  </View>

                  <Text style={styles.viewMoreBtn}>View more</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { paddingBottom: 32 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },
  cuisinesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  cuisinePill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#bc20b5",
    backgroundColor: "#fff",
    marginRight: 10,
  },
  cuisineText: {
    color: "#000",
    fontWeight: "500",
    fontSize: 13,
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  bannerWrapper: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1e3163",
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    opacity: 0.6,
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: "center",
  },
  bannerBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  bannerBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#d32f2f",
  },
  bannerRedBox: {
    backgroundColor: "#d32f2f",
    padding: 10,
    alignSelf: "flex-start",
  },
  bannerTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Oswald", // Might not be available, but native will fallback
  },
  bannerPrice: {
    color: "#ffca28",
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 4,
  },
  dotsRow: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 3,
  },
  dotActive: {
    width: 16,
    backgroundColor: "#fff",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
  },
  viewAllText: {
    fontSize: 14,
    color: "#d32f2f",
    fontWeight: "500",
  },
  empty: { textAlign: "center", color: "#64748b", marginTop: 24 },
  grid: { paddingHorizontal: 16, gap: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardLeft: {
    width: 120,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cardLogo: {
    width: "100%",
    height: 80,
  },
  cardRight: {
    flex: 1,
    padding: 12,
    paddingLeft: 4,
  },
  outletName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  outletAddress: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    lineHeight: 16,
  },
  starsWrapper: {
    flexDirection: "row",
    marginBottom: 8,
  },
  starIcon: {
    marginRight: 2,
  },
  distanceWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  pinIcon: {
    marginRight: 6,
  },
  distanceText: {
    fontSize: 13,
    color: "#888",
  },
  viewMoreBtn: {
    alignSelf: "flex-end",
    color: "#d32f2f",
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
