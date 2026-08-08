import { useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import HomePage from "./pages/HomePage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Toast from "./components/Toast";
import "./App.css";

/**
 * مكون حماية المسارات
 * يتحقق من المصادقة قبل السماح بالوصول
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useApp();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/control-panel" state={{ from: location }} replace />;
  }

  return children;
}

function AdminAccessRedirect() {
  const { isAuthenticated } = useApp();

  if (isAuthenticated) {
    return <Navigate to="/control-panel/dashboard" replace />;
  }

  return <AdminLogin />;
}

/**
 * مكون تمرير الصفحة للأعلى عند تغيير المسار
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/**
 * التوجيه الرئيسي للتطبيق
 */
function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/control-panel" element={<AdminAccessRedirect />} />
        <Route
          path="/admin"
          element={<Navigate to="/control-panel" replace />}
        />
        <Route
          path="/control-panel/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={<Navigate to="/control-panel/dashboard" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  );
}

/**
 * التطبيق الرئيسي
 * يلف المحتوى بـ AppProvider و BrowserRouter
 */
export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
}
