import { Platform } from "react-native";

/**
 * API configuration for Pocket Buddy Mobile
 *
 * ⚡ When you switch networks (home WiFi ↔ college hotspot), run:
 *
 *     npm run set-ip
 *
 * That command auto-detects your current machine IP and updates this file.
 * Then restart Expo with:  npx expo start --clear
 *
 * === DO NOT manually edit FALLBACK_IP — the script manages it ===
 */

// ──────────────────────────────────────────────────────────────────────────────
// AUTO-MANAGED by `npm run set-ip` — do not edit manually
const FALLBACK_IP = "172.20.10.3";
// ──────────────────────────────────────────────────────────────────────────────

const PORT = 3000;

const getBaseUrl = (): string => {
  // Android Emulator always uses this special loopback alias
  if (Platform.OS === "android") {
    // Detect emulator: physical devices never start with 10.0.2.x
    // In emulators, the Wi-Fi/cellular adapter typically has no real IP
    // so we can use this environment variable trick as a hint.
    // If you're on a physical Android device this branch is skipped.
    const isLikelyEmulator =
      !FALLBACK_IP ||
      FALLBACK_IP.startsWith("10.0.2") ||
      FALLBACK_IP === "localhost";
    if (isLikelyEmulator) {
      return `http://10.0.2.2:${PORT}`;
    }
  }

  return `http://${FALLBACK_IP}:${PORT}`;
};

export const API_BASE_URL = getBaseUrl();
