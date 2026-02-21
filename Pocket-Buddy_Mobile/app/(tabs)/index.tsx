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
} from "react-native";
import { router } from "expo-router";
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Discover Amazing Deals!</Text>
        <Text style={styles.heroSub}>
          Exclusive discounts at top restaurants near you
        </Text>
        <TouchableOpacity
          style={styles.heroBtn}
          onPress={() => router.push("/(tabs)/offers")}
        >
          <Text style={styles.heroBtnText}>Explore Offers</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Exclusive Offers</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#f59e0b" style={{ marginTop: 24 }} />
      ) : offers.length === 0 ? (
        <Text style={styles.empty}>No offers available</Text>
      ) : (
        <View style={styles.grid}>
          {offers.slice(0, 6).map((offer) => (
            <TouchableOpacity
              key={offer._id}
              style={styles.card}
              onPress={() => router.push(`/offer/${offer._id}`)}
              activeOpacity={0.8}
            >
              <Image
                source={{
                  uri: offer.imageURL || "https://via.placeholder.com/300",
                }}
                style={styles.cardImage}
              />
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {offer.title}
                </Text>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {offer.description || ""}
                </Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.discount}>
                    {formatDiscount(offer)}
                  </Text>
                  <Text style={styles.date}>
                    {offer.valid_to
                      ? new Date(offer.valid_to).toLocaleDateString()
                      : ""}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.claimBtn}
                  onPress={() =>
                    isLoggedIn
                      ? router.push(`/offer/${offer._id}`)
                      : router.push("/login")
                  }
                >
                  <Text style={styles.claimBtnText}>
                    {isLoggedIn ? "View" : "Sign Up to Claim"}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.loginPrompt}
        onPress={() => router.push(isLoggedIn ? "/(tabs)/user/dashboard" : "/login")}
      >
        <Text style={styles.loginPromptText}>
          {isLoggedIn ? "Go to Dashboard" : "Login to access all features"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { paddingBottom: 32 },
  hero: {
    backgroundColor: "#1e3a5f",
    padding: 28,
    paddingTop: 20,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  heroSub: { fontSize: 16, color: "rgba(255,255,255,0.9)", marginBottom: 16 },
  heroBtn: {
    backgroundColor: "#f59e0b",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  heroBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 12,
    color: "#1e293b",
  },
  empty: { textAlign: "center", color: "#64748b", marginTop: 24 },
  grid: { paddingHorizontal: 16, gap: 16 },
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
  loginPrompt: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    alignItems: "center",
  },
  loginPromptText: { color: "#92400e", fontWeight: "500" },
});
