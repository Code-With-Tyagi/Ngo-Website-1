import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useLayoutEffect } from "react";

import Home from "../pages/home.jsx";
import Services from "../pages/services.jsx";
import FindNGOs from "../pages/findNgo.jsx";
import Donate from "../pages/donate.jsx";
import Volunteer from "../pages/volunteer.jsx";
import AddNGO from "../pages/addNgo.jsx";
import Login from "../pages/login.jsx";
import Contact from "../pages/contact.jsx";
import ResetPassword from "../pages/resetPassword.jsx";

import OrphanageSupport from "../pages/services/OrphanageSupport.jsx";
import ElderlyCare from "../pages/services/ElderlyCare.jsx";
import DigitalSupport from "../pages/services/DigitalSupport.jsx";
import DignifiedRitesPage from "../pages/services/DignifiedRitesPage.jsx";

function RequireVolunteerAuth({ children }) {
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem("user"));

  if (!isLoggedIn) {
    sessionStorage.setItem(
      "flash_message",
      JSON.stringify({
        type: "info",
        message: "Please log in to access the volunteer page.",
      })
    );

    return (
      <Navigate
        to="/login"
        replace
        state={{ redirectTo: location.pathname }}
      />
    );
  }

  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />

        {/* Service Routes */}
        <Route path="/services/orphanage" element={<OrphanageSupport />} />
        <Route path="/services/elderly" element={<ElderlyCare />} />
        <Route path="/services/digital" element={<DigitalSupport />} />
        <Route path="/services/dignified-rites" element={<DignifiedRitesPage />} />

        <Route path="/find-ngos" element={<FindNGOs />} />
        <Route path="/donate" element={<Donate />} />
        <Route
          path="/volunteer"
          element={
            <RequireVolunteerAuth>
              <Volunteer />
            </RequireVolunteerAuth>
          }
        />
        <Route path="/add-ngo" element={<AddNGO />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<Navigate to="/login?forgot=1" replace />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
