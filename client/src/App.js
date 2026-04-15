import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import SocketProvider from "./context/SocketContext";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar/Navbar";
import SOSButton from "./components/ui/SOSButton";
import LawBot from "./components/ui/LawBot";
import CitizenHome from "./pages/CitizenHome";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import FileComplaint from "./pages/FileComplaint";
import PoliceDashboard from "./pages/PoliceDashboard";
import EmergencyHelp from "./pages/Citizen/EmergencyHelp";
import LiveReport from "./pages/Citizen/LiveReport";
import TrackComplaint from "./pages/Citizen/TrackComplaint";
import ViewStatus from "./pages/Citizen/ViewStatus";
import Notifications from "./pages/Citizen/Notifications";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import UpdatesFeed from "./pages/Citizen/UpdatesFeed";

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            
            {/* New Auth Flows */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />

            {/* Dashboards */}
            <Route path="/citizen/home" element={<CitizenHome />} />
            <Route path="/police" element={<PoliceDashboard />} />
            <Route path="/police/home" element={<PoliceDashboard />} />
            
            {/* Features */}
            <Route path="/file" element={<FileComplaint />} />
            <Route path="/track" element={<TrackComplaint />} />
            <Route path="/track/:id" element={<TrackComplaint />} />
            <Route path="/updates" element={<UpdatesFeed />} />
            <Route path="/status" element={<ViewStatus />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/emergency" element={<EmergencyHelp />} />
            <Route path="/live-report" element={<LiveReport />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <SOSButton />
          <LawBot />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}
