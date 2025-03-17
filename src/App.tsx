import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import IntroScreen from "./components/common/IntroScreen";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const AuthContainer = lazy(() => import("./components/auth/AuthContainer"));
const ProfileManagement = lazy(
  () => import("./components/profile/ProfileManagement"),
);
const AppSettings = lazy(() => import("./components/settings/AppSettings"));
const EmailVerification = lazy(
  () => import("./components/common/EmailVerification"),
);
const ForgotPassword = lazy(() => import("./components/auth/ForgotPassword"));
const AdminPanel = lazy(() => import("./components/admin/AdminPanel"));

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900">
              <p className="text-white text-xl">Loading...</p>
            </div>
          }
        >
          <>
            {/* For the tempo routes */}
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

            <Routes>
              <Route path="/" element={<IntroScreen />} />
              <Route
                path="/login"
                element={<AuthContainer defaultTab="login" />}
              />
              <Route
                path="/signup"
                element={<AuthContainer defaultTab="signup" />}
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfileManagement />} />
              <Route path="/settings" element={<AppSettings />} />
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin" element={<AdminPanel />} />
              {import.meta.env.VITE_TEMPO === "true" && (
                <Route path="/tempobook/*" element={<div />} />
              )}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </>
        </Suspense>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
