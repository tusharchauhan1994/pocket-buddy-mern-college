import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const SLIDE_WIDTH = width - 32;

type Offer = {
  _id: string;
  title: string;
  imageURL?: string;
  discount_value?: number;
  offer_type?: string;
};

export default function OfferSlider({ offers }: { offers: Offer[] }) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (offers.length === 0) return;
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= offers.length) nextIndex = 0;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, offers.length]);

  if (offers.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={offers}
        keyExtractor={(item) => item._id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / SLIDE_WIDTH
          );
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.slide}
            onPress={() => router.push(`/offer/${item._id}`)}
          >
            <ImageBackground
              source={{ uri: item.imageURL || "https://via.placeholder.com/400x200" }}
              style={styles.imageBg}
              imageStyle={{ borderRadius: 16 }}
            >
              <View style={styles.overlay}>
                <Text style={styles.offerTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {item.offer_type === "Flat Discount"
                      ? `₹${item.discount_value} OFF`
                      : `${item.discount_value}% OFF`}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
      <View style={styles.pagination}>
        {offers.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              currentIndex === i ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  slide: {
    width: SLIDE_WIDTH,
    height: 180,
    marginRight: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageBg: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  offerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: "#d32f2f",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  discountText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#d32f2f",
    width: 20,
  },
  inactiveDot: {
    backgroundColor: "#d1d5db",
  },
});
