import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getUser, getRedeemsByUser, getSubscriptionByUser } from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";

export default function UserProfile() {
  const { userId } = useAuth();
  const [user, setUser] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null>(null);
  const [redeemsCount, setRedeemsCount] = useState(0);
  const [sub, setSub] = useState<{ planName?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
        <Text style={styles.label}>Redemptions</Text>
        <Text style={styles.value}>{redeemsCount}</Text>
        <Text style={styles.label}>Subscription</Text>
        <Text style={styles.value}>{sub?.planName || "None"}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    gap: 4,
  },
  label: { fontSize: 12, color: "#64748b", marginTop: 12 },
  value: { fontSize: 16, marginBottom: 4 },
});
