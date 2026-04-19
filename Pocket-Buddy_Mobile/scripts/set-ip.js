/**
 * set-ip.js
 *
 * Auto-detects the machine's current LAN IP and updates src/config/api.ts.
 * Run with:  npm run set-ip
 *
 * Works on Windows (ipconfig), Mac/Linux (ip route / ifconfig).
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const CONFIG_FILE = path.join(__dirname, "../src/config/api.ts");

// ── 1. Detect current IP ──────────────────────────────────────────────────────
function getCurrentIP() {
  try {
    if (process.platform === "win32") {
      const output = execSync("ipconfig", { encoding: "utf8" });
      const lines = output.split(/\r?\n/);

      // Skip virtual/loopback adapters
      const skipAdapters = [
        "virtualbox", "vmware", "wsl", "loopback",
        "bluetooth", "tunnel", "teredo", "isatap",
      ];
      let currentAdapter = "";
      const candidates = [];

      for (const line of lines) {
        const lower = line.toLowerCase();
        if (lower.includes("adapter")) {
          currentAdapter = lower;
        }
        const shouldSkip = skipAdapters.some((s) => currentAdapter.includes(s));
        if (!shouldSkip && lower.includes("ipv4")) {
          const match = line.match(/(\d+\.\d+\.\d+\.\d+)/);
          if (match && match[1] !== "127.0.0.1") {
            candidates.push(match[1]);
          }
        }
      }

      if (candidates.length === 0) return null;

      // Prefer hotspot IPs (172.20.x.x = iPhone, 192.168.43.x = Android)
      // then regular LAN IPs, then anything else
      const prefer = (ip) =>
        ip.startsWith("172.20.10.") ? 0 :
        ip.startsWith("192.168.43.") ? 1 :
        ip.startsWith("192.168.")   ? 2 :
        ip.startsWith("10.")        ? 3 : 4;

      candidates.sort((a, b) => prefer(a) - prefer(b));
      return candidates[0];

    } else {
      // Mac / Linux
      try {
        const out = execSync("ip route get 1", { encoding: "utf8", shell: "/bin/sh" });
        const m = out.match(/src\s+(\d+\.\d+\.\d+\.\d+)/);
        if (m) return m[1];
      } catch { /* try next */ }
      const out2 = execSync("ipconfig getifaddr en0", { encoding: "utf8", shell: "/bin/sh" });
      return out2.trim() || null;
    }
  } catch (e) {
    return null;
  }
}

// ── 2. Patch api.ts ───────────────────────────────────────────────────────────
const ip = getCurrentIP();
if (!ip) {
  console.error("Could not detect a LAN IP. Are you connected to a network?");
  process.exit(1);
}

let content = fs.readFileSync(CONFIG_FILE, "utf8");

// Find the line with FALLBACK_IP and replace the IP string inside it.
// Works with both LF and CRLF line endings.
const lines = content.split(/\r?\n/);
let found = false;

const newLines = lines.map((line) => {
  if (line.trim().startsWith("const FALLBACK_IP")) {
    found = true;
    // Replace whatever IP is inside the quotes
    return line.replace(/["'][^"']*["']/, `"${ip}"`);
  }
  return line;
});

if (!found) {
  console.error("Could not find 'const FALLBACK_IP' line in api.ts.");
  console.error("Make sure the line exists as: const FALLBACK_IP = \"...\";");
  process.exit(1);
}

// Preserve original line endings (CRLF on Windows)
const eol = content.includes("\r\n") ? "\r\n" : "\n";
fs.writeFileSync(CONFIG_FILE, newLines.join(eol), "utf8");

console.log("FALLBACK_IP updated to: " + ip);
console.log("API will connect to:    http://" + ip + ":3000");
console.log("");
console.log("Next step: npx expo start --clear");
