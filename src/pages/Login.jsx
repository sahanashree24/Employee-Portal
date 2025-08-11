import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const users = [
  { email: "admin@company.com", password: "admin123", role: "admin" },
  { email: "viewer@company.com", password: "viewer123", role: "viewer" },
];

const LOCK_MS = 30000;

const Login = ({ setIsLoggedIn, setUserRole, rememberMe, setRememberMe }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [failedAttempts, setFailedAttempts] = useState(() => {
    return Number(sessionStorage.getItem("failedAttempts") || 0);
  });
  const [lockUntil, setLockUntil] = useState(() => {
    return Number(sessionStorage.getItem("lockUntil") || 0);
  });

  const isLocked = Date.now() < lockUntil;
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (isLocked) {
      const remaining = Math.max(0, Math.ceil((lockUntil - now) / 1000));
      setError(`Too many failed attempts. Try again after ${remaining}s.`);
      if (remaining <= 0) {
        sessionStorage.removeItem("failedAttempts");
        sessionStorage.removeItem("lockUntil");
        setFailedAttempts(0);
        setLockUntil(0);
        setError("");
      }
    }
  }, [now, isLocked, lockUntil]);

  const setAuthInStorage = (role, emailValue) => {
    // Clear only relevant keys to avoid accidental wipes
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userEmail");

    const store = rememberMe ? localStorage : sessionStorage;
    store.setItem("isLoggedIn", "true");
    store.setItem("userRole", role);
    store.setItem("userEmail", emailValue);
  };

  const clearLockout = () => {
    sessionStorage.removeItem("failedAttempts");
    sessionStorage.removeItem("lockUntil");
    setFailedAttempts(0);
    setLockUntil(0);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (isLocked) return;

    const user = users.find(
      (u) => u.email === email.trim() && u.password === password
    );

    if (user) {
      // success: set storage + state + navigate
      setAuthInStorage(user.role, user.email);
      clearLockout();
      setIsLoggedIn(true);
      setUserRole(user.role);
      navigate("/home", { replace: true });
    } else {
      // failure: bump attempts and maybe lock
      const next = failedAttempts + 1;
      setFailedAttempts(next);
      sessionStorage.setItem("failedAttempts", String(next));
      setError("Invalid email or password.");

      if (next >= 3) {
        const until = Date.now() + LOCK_MS;
        sessionStorage.setItem("lockUntil", String(until));
        setLockUntil(until);
        setError("Too many failed attempts. Try again after 30 seconds.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-100 via-white to-slate-100 px-4">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden max-w-5xl w-full">
        <div className="md:w-1/2 hidden md:block">
          <img src={`${process.env.PUBLIC_URL}/images/login-page2.png`} alt="Login illustration" className="h-full w-full object-cover object-top" />
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Login to Your Account</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            {error && <p className="text-red-600">{error}</p>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-700 cursor-pointer">Remember Me</label>
            </div>
            <button
              type="submit"
              disabled={isLocked}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;



































