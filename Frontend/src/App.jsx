import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/common/navbar.jsx";
import Footer from "./components/common/footer.jsx";
import AppRoutes from "./routes/AppRoute.jsx";
import { FlashProvider } from "./components/common/FlashMessage.jsx";

function App() {
  const location = useLocation();
  const [flash, setFlash] = useState(null);

  const consumeFlashMessage = () => {
    const raw = sessionStorage.getItem("flash_message");
    if (!raw) return;
    try {
      setFlash(JSON.parse(raw));
    } catch {
      setFlash({ type: "info", message: String(raw) });
    }
    sessionStorage.removeItem("flash_message");
  };

  useEffect(() => {
    consumeFlashMessage();
  }, [location.key]);

  useEffect(() => {
    if (!flash?.message) return;
    const timer = setTimeout(() => setFlash(null), 4000);
    return () => clearTimeout(timer);
  }, [flash]);

  return (
    <FlashProvider>
      <Navbar />
      {flash?.message && (
        <div className={`flash-message ${flash.type || "info"}`}>
          <span>{flash.message}</span>
          <button
            type="button"
            className="flash-close"
            onClick={() => setFlash(null)}
            aria-label="Dismiss message"
          >
            x
          </button>
        </div>
      )}
      <main className="app-content">
        <AppRoutes />
      </main>
      <Footer />
    </FlashProvider>
  );
}

export default App;
