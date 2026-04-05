import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type OfferAsRestaurant = {
  _id: string;
  title: string;
  description?: string;
  imageURL?: string;
  discount_value?: number;
};

export default function RestaurantCard({ offer }: { offer: OfferAsRestaurant }) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/offer/${offer._id}`)}
    >
      <Image
        source={{ uri: offer.imageURL || "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>
          {offer.title}
        </Text>
        <Text style={styles.address} numberOfLines={2}>
          {offer.description || "Exciting offers available now!"}
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#fff" />
            <Text style={styles.ratingText}>4.5</Text>
          </View>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.distance}>2.5 km</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.ctaText}>View More</Text>
          <Ionicons name="chevron-forward" size={16} color="#d32f2f" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  details: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  address: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16a34a",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 2,
  },
  dot: {
    color: "#cbd5e1",
    marginHorizontal: 8,
    fontSize: 18,
  },
  distance: {
    color: "#64748b",
    fontSize: 13,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  ctaText: {
    color: "#d32f2f",
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 4,
  },
});
