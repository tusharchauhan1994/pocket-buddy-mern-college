import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="profile">
      <Stack.Screen name="index" />
      <Stack.Screen name="dashboard" options={{ title: "My Dashboard" }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
      <Stack.Screen name="offers" options={{ title: "My Offers" }} />
      <Stack.Screen name="restaurants" options={{ title: "Restaurants" }} />
      <Stack.Screen name="requests" options={{ title: "My Requests" }} />
    </Stack>
  );
}
