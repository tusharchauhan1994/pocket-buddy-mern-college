import { Platform } from "react-native";

/**
 * API configuration for Pocket Buddy Mobile
 * Android Emulator: use "http://10.0.2.2:3000"
 * Physical Device: use your actual machine's local IP on the network
 */
export const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://192.168.1.8:3000";
