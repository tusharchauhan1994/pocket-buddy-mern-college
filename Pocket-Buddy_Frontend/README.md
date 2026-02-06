---

### 🟢 **Frontend README** (`pocket-buddy-frontend/README.md`)

````markdown
# 🍽️ Pocket Buddy – Frontend

Pocket Buddy is a full-stack MERN platform that connects food lovers with the best restaurant deals while giving restaurant owners powerful tools to manage and promote offers.  
This repository contains the **React + Vite frontend** that delivers a fast, mobile-friendly user experience.

---

## ✨ Key Features
- 🎯 **User Dashboard** with hero section, filters, and highlighted offers.
- 🔍 **Smart Search & Filters** to find deals by cuisine, category, or distance.
- 💳 **Subscription Flow** with Razorpay integration.
- 📱 Responsive, modern UI using **Tailwind CSS**.

---

## 🛠️ Tech Stack
- **React 18 + Vite** for blazing-fast builds and hot reloading.
- **Tailwind CSS** for styling.
- **Axios** for API communication with the backend.

---

## ⚙️ Setup & Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-org/pocket-buddy-frontend.git
   cd pocket-buddy-frontend
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**
   Create a `.env` file and add:

   ```
   VITE_API_URL=<your-backend-url>
   VITE_RAZORPAY_KEY=<your-razorpay-key>
   ```

4. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```
src/
 ├─ components/   # Reusable UI components
 ├─ pages/        # Views: Dashboard, Offers, Profile, etc.
 ├─ hooks/        # Custom React hooks
 └─ ...
```

---

## 🌟 Planned Enhancements

* 🤖 AI-powered personalized offer recommendations.
* 🔔 Real-time notifications for new or expiring deals.
* 🌐 Multi-language support.

---

## 👥 Authors

* **Tushar Chauhan** – Frontend & Full-stack Development
  Guided by **Samir Vithlani**, L.J. University
  Special thanks to Grownited P Ltd.

---

````

---

### 🟠 **Backend README** (`pocket-buddy-backend/README.md`)

```markdown
# 🍽️ Pocket Buddy – Backend

This repository hosts the **Node.js + Express backend** for Pocket Buddy.  
It provides secure APIs, database operations, and integrations for subscriptions, offer management, and redemption flows.

---

## ✨ Core Features
- 👥 **Role-Based Access**: Admin, Restaurant Owner, and User.
- 🎯 **Offer Management**: Create, update, and delete offers with approval workflow.
- 🔁 **Redemption Flow**: User requests → Owner approves/declines → Redemption recorded.
- 💳 **Subscriptions & Payments**: Razorpay integration with admin tracking.
- ☁️ **Image Uploads**: Multer + Cloudinary for restaurant and offer images.

---

## 🛠️ Tech Stack
- **Node.js + Express.js**
- **MongoDB (Mongoose)**
- **Razorpay API** for payments
- **Cloudinary** for image hosting
- **JWT Authentication**

---

## ⚙️ Setup & Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-org/pocket-buddy-backend.git
   cd pocket-buddy-backend
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**
   Create a `.env` file with:

   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-secret>
   RAZORPAY_KEY_ID=<your-razorpay-key-id>
   RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
   CLOUDINARY_CLOUD_NAME=<cloud-name>
   CLOUDINARY_API_KEY=<api-key>
   CLOUDINARY_API_SECRET=<api-secret>
   ```

4. **Run the server**

   ```bash
   npm run dev
   ```

   API runs on [http://localhost:5000](http://localhost:5000).

---

## 📂 Project Structure

```
controllers/    # Business logic
models/         # Mongoose schemas (User, Offer, RedeemOffer, Subscription)
routes/         # Express routes
utils/          # Helpers (Cloudinary, mail, etc.)
server.js
```

---

## 🌟 Future Enhancements

* 🤖 AI-driven personalized offers.
* 🏷️ QR code–based in-store redemption.
* 📊 Admin analytics dashboard.

---

## 👥 Authors

* **Tushar Chauhan** – Backend & Full-stack Development
  Guided by **Samir Vithlani**, Royal Technosoft PVT L.T.D.
  Special thanks to Grownited P Ltd.

---
