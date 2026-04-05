import { useEffect } from "react";
import { router } from "expo-router";

export default function UserIndex() {
  useEffect(() => {
    router.replace("/(tabs)/user/profile");
  }, []);
  return null;
}
