import { useState, useEffect, lazy, Suspense } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Background from "./components/Background";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import SectionDivider from "./components/SectionDivider";
import { api } from "./services/api";

const AdminLoginModal = lazy(() => import("./components/admin/AdminLoginModal"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "/admin-login";

function App() {
  const [token, setToken] = useState(localStorage.getItem("portfolio_admin_token") || null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Track visitor analytics once per session (ignore secret admin visits from analytics)
  useEffect(() => {
    const isSecretAdminRoute =
      window.location.pathname.toLowerCase() === ADMIN_PATH.toLowerCase();

    if (!isSecretAdminRoute) {
      const hasVisited = sessionStorage.getItem("portfolio_visited");
      if (!hasVisited) {
        api.trackVisit(window.location.pathname, document.referrer);
        sessionStorage.setItem("portfolio_visited", "true");
      }
    }
  }, []);

  // Listen to secret Admin URL (e.g. /admin-login or #admin-login)
  useEffect(() => {
    const checkAdminRoute = () => {
      const currentPath = window.location.pathname.toLowerCase();
      const currentHash = window.location.hash.toLowerCase();
      const targetPath = ADMIN_PATH.toLowerCase();
      const targetHash = `#${targetPath.replace(/^\//, "")}`;

      if (currentPath === targetPath || currentHash === targetHash) {
        if (token) {
          setIsDashboardOpen(true);
        } else {
          setIsLoginOpen(true);
        }
      }
    };

    checkAdminRoute();
    window.addEventListener("popstate", checkAdminRoute);
    window.addEventListener("hashchange", checkAdminRoute);
    return () => {
      window.removeEventListener("popstate", checkAdminRoute);
      window.removeEventListener("hashchange", checkAdminRoute);
    };
  }, [token]);

  // Secret hotkey shortcut: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        if (token) {
          setIsDashboardOpen(true);
        } else {
          setIsLoginOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [token]);

  const handleCloseAdmin = () => {
    setIsLoginOpen(false);
    setIsDashboardOpen(false);
    const currentPath = window.location.pathname.toLowerCase();
    const currentHash = window.location.hash.toLowerCase();
    const targetPath = ADMIN_PATH.toLowerCase();
    const targetHash = `#${targetPath.replace(/^\//, "")}`;

    if (currentPath === targetPath || currentHash === targetHash) {
      window.history.pushState(null, "", "/");
    }
  };

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    setIsLoginOpen(false);
    setIsDashboardOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("portfolio_admin_token");
    localStorage.removeItem("portfolio_admin_user");
    setToken(null);
    handleCloseAdmin();
  };

  const handleDataUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <ThemeProvider>
      <Background />
      <Navbar />
      <main>
        <Hero />
        <SectionDivider />
        <Skills refreshTrigger={refreshTrigger} />
        <SectionDivider />
        <Projects refreshTrigger={refreshTrigger} />
        <SectionDivider />
        <Education />
        <SectionDivider />
        <Contact />
        <SectionDivider />
        <Footer />
      </main>

      {/* Secret Admin Modals with Suspense */}
      <Suspense fallback={null}>
        {isLoginOpen && (
          <AdminLoginModal
            isOpen={isLoginOpen}
            onClose={handleCloseAdmin}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {isDashboardOpen && (
          <AdminDashboard
            isOpen={isDashboardOpen}
            onClose={handleCloseAdmin}
            onLogout={handleLogout}
            onDataUpdated={handleDataUpdated}
          />
        )}
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
