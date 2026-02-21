# Pocket Buddy Mobile

Native mobile frontend for **Pocket Buddy** – a MERN-based food offers platform. This React Native (Expo) app connects to the existing Pocket-Buddy_Backend API.

## Prerequisites

- Node.js 18+
- Expo CLI (`npx expo`)
- Pocket-Buddy_Backend running at `http://localhost:3000`
- For device testing: same WiFi network and backend URL updated in `src/config/api.ts`

## Setup

```bash
cd Pocket-Buddy_Mobile
npm install
npx expo start
```

## API Configuration

Edit `src/config/api.ts` to point to your backend:

- **iOS Simulator / Web**: `http://localhost:3000`
- **Android Emulator**: `http://10.0.2.2:3000`
- **Physical device**: `http://<YOUR_PC_IP>:3000` (e.g. `http://192.168.1.100:3000`)

## Features

- **Guest**: Home, Offers, Restaurants ( browse without login )
- **User**: Dashboard, Profile, Browse Offers, Restaurants, Redemption Requests
- **Restaurant Owner**: Dashboard with offers and pending requests summary
- **Admin**: Dashboard with users, restaurants, offers, subscriptions counts

## Roles

- **User**: Browse offers, redeem, view profile and requests
- **Restaurant**: View dashboard metrics
- **Admin**: View admin dashboard metrics

Full CRUD for restaurants, offers, and admin management is available on the web frontend (Pocket-Buddy_Frontend).

## Tech Stack

- Expo SDK 54
- React Native
- Expo Router (file-based routing)
- Axios
- AsyncStorage for auth

## Project Structure

```
app/
  (tabs)/         # Main tabs: Home, Offers, Restaurants, Login/User
  (auth)/         # Restaurant & Admin dashboards
  offer/[id].tsx  # Offer detail & redeem
  login.tsx
  register.tsx
src/
  config/api.ts
  contexts/AuthContext.tsx
  services/api.ts
```
