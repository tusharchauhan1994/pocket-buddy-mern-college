import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getUser, getRedeemsByUser, getSubscriptionByUser } from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";
import ProfileMenuItem from "@/src/components/ProfileMenuItem";

export default function UserProfile() {
  const { userId, logout } = useAuth();
  const [user, setUser] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null>(null);
  const [redeemsCount, setRedeemsCount] = useState(0);
  const [sub, setSub] = useState<{ planName?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    Promise.all([
      getUser(userId),
      getRedeemsByUser(userId),
      getSubscriptionByUser(userId),
    ])
      .then(([uRes, rRes, sRes]) => {
        const u = uRes.data?.data ?? uRes.data;
        setUser(u || null);
        const redeems = rRes.data?.redeems ?? rRes.data ?? [];
        setRedeemsCount(Array.isArray(redeems) ? redeems.length : 0);
        const s = sRes.data?.subscription ?? sRes.data;
        setSub(s || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d32f2f" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Section */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarLetter}>
              {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
            </Text>
            <View style={styles.badge}>
              <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
            </View>
          </View>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.email || "user@example.com"}</Text>
          <Text style={styles.statLine}>
            Redemptions: {redeemsCount}
          </Text>
        </View>

        {/* Membership Card */}
        <View style={styles.membershipCard}>
          <Text style={styles.membershipTitle}>
            {sub?.planName === "Gold" || sub?.planName === "Premium" ? "Active Premium Membership" : "Exclusive Restaurant Membership"}
          </Text>
          <Text style={styles.membershipSubTitle}>
            {sub?.planName ? `Current Plan: ${sub.planName}` : "₹99/mo to unlock VIP deals"}
          </Text>
          
          <View style={styles.membershipDots}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          {!sub?.planName && (
            <TouchableOpacity style={styles.buyNowBtn} activeOpacity={0.8} onPress={() => router.push("/(tabs)/user/dashboard")}>
              <Text style={styles.buyNowText}>BUY NOW</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Menu List */}
        <View style={styles.menuContainer}>
          <ProfileMenuItem icon="person-outline" title="Edit Profile" onPress={() => {}} />
          <ProfileMenuItem icon="heart-outline" title="My Favourites" onPress={() => {}} />
          <ProfileMenuItem icon="wallet-outline" title="My Wallet" onPress={() => {}} />
          <ProfileMenuItem icon="star-outline" title="My Reviews" onPress={() => {}} />
          <ProfileMenuItem icon="ticket-outline" title="My Redemptions" onPress={() => router.push("/(tabs)/user/requests")} />
          <ProfileMenuItem icon="gift-outline" title="Invite Friends" onPress={() => {}} />
          <ProfileMenuItem icon="log-out-outline" title="Logout" onPress={handleLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" },
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  iconBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  userSection: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#ffffff",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#d32f2f",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#d32f2f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarLetter: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  badge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 2,
  },
  userName: { fontSize: 22, fontWeight: "bold", color: "#1e293b", marginBottom: 4 },
  userEmail: { fontSize: 14, color: "#64748b", marginBottom: 8 },
  statLine: { fontSize: 13, color: "#16a34a", fontWeight: "600" },
  membershipCard: {
    backgroundColor: "#1e293b",
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  membershipTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  membershipSubTitle: { color: "#cbd5e1", fontSize: 14, marginBottom: 16 },
  membershipDots: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.3)", marginRight: 6 },
  activeDot: { width: 16, backgroundColor: "#fff" },
  buyNowBtn: {
    backgroundColor: "#d32f2f",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buyNowText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  menuContainer: {
    marginTop: 24,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f1f5f9",
  },
});
