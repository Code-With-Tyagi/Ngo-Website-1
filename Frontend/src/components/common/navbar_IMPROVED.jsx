import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LanguageToggle from "../LanguageToggle.jsx";
import {
  determineUserType,
  getNavbarItems,
  getProfileMenuItems,
  getNavbarColor,
  USER_TYPES,
} from "../../utils/roleDetection.js";
import "./navbar.css";

/**
 * Universal Navbar Component
 * Automatically displays different UI based on user role
 */
function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(USER_TYPES.VISITOR);

  const readUser = () => {
    const raw = localStorage.getItem("user");
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  // Initialize user and determine type
  useEffect(() => {
    const currentUser = readUser();
    const isLoggedInState = Boolean(localStorage.getItem("token"));

    setIsLoggedIn(isLoggedInState);
    setUser(currentUser);

    if (isLoggedInState && currentUser) {
      setUserType(determineUserType(currentUser));
    } else {
      setUserType(USER_TYPES.VISITOR);
    }
  }, []);

  // Listen for auth changes
  useEffect(() => {
    const syncAuth = () => {
      const currentUser = readUser();
      const isLoggedInState = Boolean(localStorage.getItem("token"));

      setIsLoggedIn(isLoggedInState);
      setUser(currentUser);

      if (isLoggedInState && currentUser) {
        setUserType(determineUserType(currentUser));
      } else {
        setUserType(USER_TYPES.VISITOR);
      }
    };

    window.addEventListener("authChanged", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("authChanged", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const handleLogout = async (e) => {
    if (e) e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      if (token) {
        await fetch("http://localhost:5000/api/logout", {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {
      // Silently fail if logout endpoint doesn't exist
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("authChanged"));
      setMenuOpen(false);
      setProfileDropdownOpen(false);

      sessionStorage.setItem(
        "flash_message",
        JSON.stringify({ type: "success", message: "Logged out successfully." })
      );
      navigate("/");
    }
  };

  const navbarItems = getNavbarItems(userType);
  const profileMenuItems = getProfileMenuItems(userType);
  const navbarColor = getNavbarColor(userType);
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  // Render navbar
  return (
    <>
      <nav
        className={`navbar navbar-${userType}`}
        style={{ borderBottomColor: navbarColor }}
      >
        {/* Logo */}
        <div
          className="navbar-logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <span className="logo-icon" style={{ color: navbarColor }}>
            ❤️
          </span>
          <span className="logo-text">
            Seva<span>India</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="navbar-menu">
          {navbarItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} style={{ color: navbarColor }}>
                {item.label}
                {item.badge && (
                  <span className="navbar-badge" style={{ background: item.badge }}>
                    !
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth Section */}
        <div className="navbar-auth">
          <LanguageToggle />

          {isLoggedIn && user ? (
            <div
              className="dropdown profile-dropdown"
              onMouseEnter={() => setProfileDropdownOpen(true)}
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <div
                className="profile-icon"
                style={{ background: navbarColor }}
                title={`${user.name} (${userType})`}
              >
                {userInitial}
              </div>

              {profileDropdownOpen && profileMenuItems.length > 0 && (
                <ul className="dropdown-menu profile-menu-right">
                  {profileMenuItems.map((item) => (
                    item.divider ? (
                      <li key="divider" className="dropdown-divider" />
                    ) : (
                      <li key={item.path}>
                        <Link to={item.path} className="profile-link">
                          {item.label}
                        </Link>
                      </li>
                    )
                  ))}

                  <li className="dropdown-divider" />
                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-logout-btn"
                    >
                      🔓 Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="login-btn"
              style={{ borderColor: navbarColor, color: navbarColor }}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          style={{ color: navbarColor }}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-header">
          <span style={{ color: navbarColor }}>Menu</span>
          <button
            className="close-btn"
            onClick={() => setMenuOpen(false)}
            style={{ color: navbarColor }}
          >
            ✕
          </button>
        </div>

        <ul>
          {/* Language Toggle */}
          <li style={{ borderBottom: "2px solid #f0f0f0", paddingBottom: "10px", marginBottom: "10px" }}>
            <LanguageToggle />
          </li>

          {/* Navigation Items */}
          {navbarItems.map((item) => (
            <li key={item.path} onClick={() => setMenuOpen(false)}>
              <Link to={item.path} style={{ color: navbarColor }}>
                {item.label}
              </Link>
            </li>
          ))}

          {/* Logged In User Menu */}
          {isLoggedIn && user ? (
            <>
              <li style={{ borderTop: "2px solid #f0f0f0", marginTop: "10px", paddingTop: "10px" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: navbarColor,
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  <div
                    className="profile-icon mobile-icon"
                    style={{
                      background: navbarColor,
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {userInitial}
                  </div>
                  {user.name} ({userType})
                </span>
              </li>

              {/* Profile Menu Items for Mobile */}
              {profileMenuItems.map((item) => (
                item.divider ? (
                  <li key="divider" style={{ borderTop: "2px solid #f0f0f0", margin: "10px 0" }} />
                ) : (
                  <li key={item.path} onClick={() => setMenuOpen(false)}>
                    <Link to={item.path} style={{ color: navbarColor, fontSize: "14px" }}>
                      {item.label}
                    </Link>
                  </li>
                )
              ))}

              {/* Logout Button */}
              <li style={{ borderTop: "2px solid #f0f0f0", marginTop: "10px" }}>
                <button
                  type="button"
                  className="logout-btn-mobile"
                  style={{
                    background: navbarColor,
                    color: "white",
                    border: "none",
                    padding: "10px",
                    width: "100%",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                  onClick={handleLogout}
                >
                  🔓 Logout
                </button>
              </li>
            </>
          ) : (
            <li onClick={() => setMenuOpen(false)}>
              <Link
                to="/login"
                style={{
                  color: navbarColor,
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Login / Sign Up
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

export default Navbar;
