import { useState, useEffect } from "react";
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
import { lazy, Suspense } from "react";
const AdminLoginModal = lazy(() => import("./components/admin/AdminLoginModal"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
import { api } from "./services/api";

function App() {
  const [token, setToken] = useState(localStorage.getItem("portfolio_admin_token") || null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Track visitor analytics once per session
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("portfolio_visited");
    if (!hasVisited) {
      api.trackVisit(window.location.pathname, document.referrer);
      sessionStorage.setItem("portfolio_visited", "true");
    }
  }, []);

  // Keyboard shortcut Ctrl + Shift + A for Admin Portal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        handleOpenAdmin();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [token]);

  const handleOpenAdmin = () => {
    if (token) {
      setIsDashboardOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    setIsDashboardOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("portfolio_admin_token");
    localStorage.removeItem("portfolio_admin_user");
    setToken(null);
    setIsDashboardOpen(false);
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
        <Footer onOpenAdmin={handleOpenAdmin} />
      </main>

      {/* Admin Modals with Suspense */}
      <Suspense fallback={null}>
        {isLoginOpen && (
          <AdminLoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {isDashboardOpen && (
          <AdminDashboard
            isOpen={isDashboardOpen}
            onClose={() => setIsDashboardOpen(false)}
            onLogout={handleLogout}
            onDataUpdated={handleDataUpdated}
          />
        )}
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
