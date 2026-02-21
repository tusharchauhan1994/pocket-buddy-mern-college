import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { getRestaurants } from "@/src/services/api";

type Restaurant = {
  _id: string;
  title: string;
  description?: string;
  address?: string;
  ownerName?: string;
  imageURL?: string;
};

export default function UserRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRestaurants()
      .then((res) => {
        const data = res.data?.data || res.data || [];
        const list: Restaurant[] = [];
        if (Array.isArray(data)) {
          data.forEach(
            (owner: {
              restaurants?: Restaurant[];
              name?: string;
            }) => {
              if (owner.restaurants?.length) {
                owner.restaurants.forEach((r) => {
                  list.push({ ...r, ownerName: owner.name });
                });
              }
            }
          );
        }
        setRestaurants(list);
      })
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item }: { item: Restaurant }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.imageURL || "https://via.placeholder.com/400x200" }}
        style={styles.cardImage}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardMeta}>{item.ownerName}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description || ""}
        </Text>
        {item.address && (
          <TouchableOpacity
            style={styles.mapBtn}
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address!)}`
              )
            }
          >
            <Text style={styles.mapBtnText}>Open in Maps</Text>
          </TouchableOpacity>
        )}
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
      data={restaurants}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.empty}>No restaurants</Text>}
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
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  cardMeta: { fontSize: 14, color: "#64748b", marginBottom: 4 },
  cardDesc: { fontSize: 14, color: "#94a3b8", marginBottom: 8 },
  mapBtn: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#eff6ff",
    borderRadius: 8,
  },
  mapBtnText: { color: "#3b82f6", fontWeight: "500" },
  empty: { textAlign: "center", color: "#64748b", marginTop: 32 },
});
