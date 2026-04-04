import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { getUser } from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";
import { Feather } from "@expo/vector-icons";

export default function UserProfile() {
  const { userId } = useAuth();
  const [user, setUser] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    getUser(userId)
      .then((uRes) => {
        const u = uRes.data?.data ?? uRes.data;
        setUser(u || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d32f2f" />
      </View>
    );
  }

  const menuOptions = [
    { icon: "edit", label: "Edit profile" },
    { icon: "bookmark", label: "My Favourites" },
    { icon: "credit-card", label: "My Wallet" },
    { icon: "message-square", label: "My Reviews" },
    { icon: "gift", label: "My Deals" },
    { icon: "users", label: "Invite Friends" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="chevron-left" size={26} color="#444" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Feather name="bell" size={22} color="#444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Avatar / Icons Area */}
        <View style={styles.avatarSection}>
          <View style={styles.floatingIcons}>
            <View style={[styles.redIconCircle, { marginLeft: -20 }]}>
              <Feather name="alert-circle" size={12} color="#fff" />
            </View>
            <View style={[styles.redIconCircle, { marginTop: 30, marginLeft: 10 }]}>
              <Feather name="star" size={12} color="#fff" />
            </View>
          </View>
          <Text style={styles.userName}>
            {user?.firstName || "Guest"} {user?.lastName || ""}
          </Text>
        </View>

        {/* Membership Card */}
        <View style={styles.membershipCard}>
          <View style={styles.membershipInner}>
            <View style={styles.membershipContent}>
              <View style={styles.checkWrapper}>
                <Feather name="check" size={14} color="#fff" />
              </View>
              <Text style={styles.membershipText}>
                EXCLUSIVE RESTAURANT MEMBERSHIP{"\n"}JUST ₹99/-MO
              </Text>
            </View>
            <View style={styles.dotsRow}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
          <TouchableOpacity style={styles.buyBtn}>
            <Text style={styles.buyBtnText}>BUY NOW</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuOptions.map((opt, idx) => (
            <TouchableOpacity key={idx} style={styles.menuItem}>
              <Feather name={opt.icon as any} size={22} color="#d32f2f" style={styles.menuIcon} />
              <Text style={styles.menuText}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "500", color: "#000" },
  content: { paddingBottom: 40 },
  avatarSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  floatingIcons: {
    flexDirection: "row",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  redIconCircle: {
    backgroundColor: "#d32f2f",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
  },
  membershipCard: {
    marginHorizontal: 20,
    backgroundColor: "#e5e5e5",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#d4d4d4",
  },
  membershipInner: {
    padding: 16,
    paddingBottom: 10,
  },
  membershipContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkWrapper: {
    backgroundColor: "#d32f2f",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  membershipText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    lineHeight: 18,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 12,
    height: 4,
    backgroundColor: "#999",
    borderRadius: 2,
  },
  dotActive: {
    backgroundColor: "#d32f2f",
  },
  buyBtn: {
    backgroundColor: "#d32f2f",
    paddingVertical: 14,
    alignItems: "center",
  },
  buyBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
  },
  menuIcon: {
    marginRight: 20,
  },
  menuText: {
    fontSize: 18,
    color: "#222",
    fontWeight: "500",
  },
});
