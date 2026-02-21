import { Stack } from "expo-router";

export default function RestaurantLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Stack.Screen name="my-restaurant" options={{ title: "My Restaurants" }} />
      <Stack.Screen name="add-restaurant" options={{ title: "Add Restaurant" }} />
      <Stack.Screen name="my-offers" options={{ title: "My Offers" }} />
      <Stack.Screen name="manage-requests" options={{ title: "Manage Requests" }} />
      <Stack.Screen name="add-offer" options={{ title: "Add Offer" }} />
    </Stack>
  );
}
