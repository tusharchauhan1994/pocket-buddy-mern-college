import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { getOfferById, createRedeem } from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";

type Offer = {
  _id: string;
  title: string;
  description?: string;
  offer_type?: string;
  discount_value?: number;
  valid_from?: string;
  valid_to?: string;
  min_order_value?: number;
  imageURL?: string;
};

export default function OfferDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId, isLoggedIn } = useAuth();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    if (id) {
      getOfferById(id)
        .then((res) => {
          const data = res.data?.data ?? res.data?.offer ?? res.data;
          setOffer(data || null);
        })
        .catch(() => setOffer(null))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleRedeem = async () => {
    if (!isLoggedIn || !userId) {
      router.push("/login");
      return;
    }
    if (!offer) return;
    setRedeeming(true);
    try {
      await createRedeem({ user_id: userId, offer_id: offer._id });
      Alert.alert("Success", "Redemption request submitted!");
      router.back();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to redeem";
      Alert.alert("Error", msg);
    } finally {
      setRedeeming(false);
    }
  };

  const formatDiscount = (o: Offer) => {
    if (o.offer_type === "Flat Discount") return `₹${o.discount_value} OFF`;
    if (o.offer_type === "Percentage") return `${o.discount_value}% OFF`;
    return o.offer_type || "Offer";
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  if (!offer) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Offer not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={{ uri: offer.imageURL || "https://via.placeholder.com/400" }}
        style={styles.image}
      />
      <View style={styles.body}>
        <Text style={styles.title}>{offer.title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{formatDiscount(offer)}</Text>
        </View>
        <Text style={styles.desc}>{offer.description || ""}</Text>
        {offer.valid_to && (
          <Text style={styles.date}>
            Valid until: {new Date(offer.valid_to).toLocaleDateString()}
          </Text>
        )}
        {offer.min_order_value && (
          <Text style={styles.minOrder}>
            Min order: ₹{offer.min_order_value}
          </Text>
        )}
        <TouchableOpacity
          style={[styles.redeemBtn, redeeming && styles.btnDisabled]}
          onPress={handleRedeem}
          disabled={redeeming}
        >
          {redeeming ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.redeemBtnText}>
              {isLoggedIn ? "Redeem Offer" : "Login to Redeem"}
            </Text>
          )}
        </TouchableOpacity>
        {!isLoggedIn && (
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginLinkText}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "#64748b", marginBottom: 16 },
  image: { width: "100%", height: 220 },
  body: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  badgeText: { color: "#fff", fontWeight: "600" },
  desc: { fontSize: 16, color: "#475569", marginBottom: 12 },
  date: { fontSize: 14, color: "#94a3b8", marginBottom: 4 },
  minOrder: { fontSize: 14, color: "#94a3b8", marginBottom: 24 },
  redeemBtn: {
    backgroundColor: "#f59e0b",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.7 },
  redeemBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  backBtn: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
  },
  backBtnText: { fontWeight: "600" },
  loginLink: { marginTop: 16, alignItems: "center" },
  loginLinkText: { color: "#3b82f6", fontSize: 14 },
});
