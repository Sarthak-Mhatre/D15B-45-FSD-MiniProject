import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust this path to your context location
import axios from "axios";

const AuthRedirect = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setAuth } = useAuth();

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      // 1. Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // 2. Fetch user and update context
      axios
        .get("http://localhost:3000/profile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => {
          setAuth({
            user: res.data.user,
            accessToken,
            refreshToken,
          });
          // 3. Clean the URL (removes token info)
          window.history.replaceState({}, document.title, window.location.pathname);
          // 4. Redirect to homepage
          navigate("/", { replace: true });
        })
        .catch(() => {
          // If token is bad, log out and redirect
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setAuth({ user: null, accessToken: null, refreshToken: null });
          navigate("/login", { replace: true });
        });
    } else {
      navigate("/login", { replace: true });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
    </div>
  );
};

export default AuthRedirect;
