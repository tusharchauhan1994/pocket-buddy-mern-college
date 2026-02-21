import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="dashboard" options={{ title: "Admin Dashboard" }} />
      <Stack.Screen name="users" options={{ title: "Manage Users" }} />
      <Stack.Screen name="restaurants" options={{ title: "Manage Restaurants" }} />
      <Stack.Screen name="offers" options={{ title: "Manage Offers" }} />
      <Stack.Screen name="subscriptions" options={{ title: "Subscriptions" }} />
    </Stack>
  );
}
