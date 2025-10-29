import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import Toast from "./components/toast/Toast";
import EditorPage from "./pages/EditorPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Navbar from "../src/components/common/Navbar";
import { useAuth } from "../src/context/AuthContext";
import AuthRedirect from "../src/pages/AuthRedirect"; // Import your AuthRedirect

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { auth } = useAuth();
  if (!auth.user) return <Navigate to="/login" />;
  return children;
};

const App = () => {
  const { auth } = useAuth();

  return (
    <>
      <Router>
        {/* Show Navbar only if user is authenticated */}
        {auth.user && <Navbar />}
        <Routes>
          {/* Login page: Only show when not authenticated */}
          <Route
            path="/login"
            element={!auth.user ? <LoginPage /> : <Navigate to="/" />}
          />
          {/* Dedicated route for Google OAuth SPA redirect */}
          <Route
            path="/auth/redirect"
            element={<AuthRedirect />}
          />
          {/* Protected HomePage */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          {/* Protected EditorPage */}
          <Route
            path="/editor/:roomId"
            element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            }
          />
          {/* Catch-all: redirect to home if authenticated; otherwise login */}
          <Route
            path="*"
            element={
              auth.user ? <Navigate to="/" /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </Router>
      <Toast />
    </>
  );
};

export default App;
