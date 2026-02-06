import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoutes from "./hook/PrivateRoutes";
import NotFound from "./components/common/NotFound";

// Guest Pages
import Home from "./components/guest/Home";
import About from "./components/guest/About";
import Menu from "./components/guest/Menu";
import Dishes from "./components/guest/Dishes";
import Review from "./components/guest/Review";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";

// User Pages
import { UserDashboard } from "./components/user/UserDashboard";
import { AddRestaurant } from "./components/restaurant/AddRestaurant";
import UserDishes from "./components/user/UserDishes";
import UserAbout from "./components/user/UserAbout";
import UserMenu from "./components/user/UserMenu";
import UserReview from "./components/user/UserReview";

// Restaurant Pages
import { ViewMyRestaurant } from "./components/restaurant/ViewMyRestaurant";
import { UpdateMyRestaurant } from "./components/restaurant/UpdateMyRestaurant";
import AddOffer from "./components/restaurant/AddOffer";
import { RestaurantDashboard } from "./components/restaurant/RestaurantDashboard";
import Unauthorized from "./components/pages/Unauthorized";

// Admin Pages
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminManageRestaurants from "./components/admin/AdminManageRestaurants";
import AdminManageRestaurants2 from "./components/admin/AdminManageRestaurants2";
import { AddUpdateRestaurant } from "./components/restaurant/AddUpdateRestaurant";
import RestaurantOffers from "./components/restaurant/RestaurantOffers";
import ResetPassword from "./components/auth/ResetPassword";
import { UserOfferDetail } from "./components/user/UserOfferDetail";
import ManageOfferRequests from "./components/restaurant/ManageOfferRequests";
import { UserRequests } from "./components/user/UserRequests";
import UserOffers from "./components/user/UserOffers";
import UserRestaurant from "./components/user/UserRestaurant";
import AdminManageOffers from "./components/admin/AdminManageOffers";
import GuestOffers from "./components/guest/GuestOffers";
import { GuestRestaurant } from "./components/guest/GuestRestaurant";
import { GuestRestaurantOffersPage } from "./components/guest/GuestRestaurantOffersPage";
import SubscriptionPlans from "./components/user/SubscriptionPlans";
import UserProfilePage from "./components/user/UserProfilePage";
import AdminSubscription from "./components/admin/AdminSubscription";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/offers" element={<GuestOffers />} />
      <Route path="/restaurants" element={<GuestRestaurant />} />
      <Route path="/restaurant/:id/offers" element={<GuestRestaurantOffersPage />} />
      <Route path="/review" element={<Review />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/aboutUs" element={<UserAbout/>}/>
      <Route path="/subscriptionPlans" element={<SubscriptionPlans/>}/>

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/forgot-password/" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* <Route path="/reset-password/:token" element={<ResetPassword />} /> */}

      {/* Protected Routes */}
      <Route element={<PrivateRoutes />}>
        {/* User Routes */}
        <Route path="/user/profile" element={<UserProfilePage />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/MyRequests" element={<UserRequests />} />
        <Route path="/user/offers" element={<UserOffers />} />
        <Route path="/user/restaurants" element={<UserRestaurant />} />


        <Route path="/user/dishes" element={<UserDishes />} />
        <Route path="/user/about" element={<UserAbout />} />
        <Route path="/user/menu" element={<UserMenu />} />
        <Route path="/user/review" element={<UserReview />} />
        <Route path="/offer/:id" element={<UserOfferDetail />} />


        {/* Restaurant Routes */}
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        <Route path="/restaurant/addOffer" element={<AddOffer />} />
        <Route path="/restaurant/addRestaurant" element={<AddRestaurant />} />
        <Route
          path="/restaurant/addUpdateRestaurant"
          element={<AddUpdateRestaurant />}
        />
        <Route path="/restaurant/myRestaurant" element={<ViewMyRestaurant />} />
        <Route path="/restaurant/myOffers" element={<RestaurantOffers />} />
        <Route
          path="/restaurant/updateRestaurant/:id"
          element={<UpdateMyRestaurant />}
        />
        <Route path="/restaurant/ManageOfferRequests" element={<ManageOfferRequests />} />
        



        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users/" element={<AdminUsers />} />
        <Route path="/admin/restaurants" element={<AdminManageRestaurants />} />
        <Route
          path="/admin/restaurants2"
          element={<AdminManageRestaurants2 />}
        />
        <Route path="/admin/Offers" element={<AdminManageOffers />} />
        <Route path="/admin/subscription" element={<AdminSubscription />} />

        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
