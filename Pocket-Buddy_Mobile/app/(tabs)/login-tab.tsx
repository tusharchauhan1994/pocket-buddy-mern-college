import { useEffect } from "react";
import { router } from "expo-router";

export default function LoginTabRedirect() {
  useEffect(() => {
    router.replace("/login");
  }, []);
  return null;
}
