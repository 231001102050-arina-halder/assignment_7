import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Lock, LogOut, ShieldCheck, User } from "lucide-react";

const STORAGE_KEY = "assignment7Auth";
const REMEMBERED_USERNAME_KEY = "assignment7RememberedUsername";

function getStoredAuth() {
  const localAuth = localStorage.getItem(STORAGE_KEY);
  const sessionAuth = sessionStorage.getItem(STORAGE_KEY);
  const rawAuth = localAuth || sessionAuth;

  if (!rawAuth) return null;

  try {
    return JSON.parse(rawAuth);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function saveAuth(auth, rememberMe) {
  const serializedAuth = JSON.stringify(auth);

  if (rememberMe) {
    localStorage.setItem(STORAGE_KEY, serializedAuth);
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(REMEMBERED_USERNAME_KEY, auth.user.username);
  } else {
    sessionStorage.setItem(STORAGE_KEY, serializedAuth);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(REMEMBERED_USERNAME_KEY);
  }
}

function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
}

function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (!password) return { label: "Enter a password", level: "empty", score: 0 };
  if (score <= 2) return { label: "Weak", level: "weak", score };
  if (score <= 4) return { label: "Medium", level: "medium", score };
  return { label: "Strong", level: "strong", score };
}

function LoginPage({ onLogin }) {
  const rememberedUsername = localStorage.getItem(REMEMBERED_USERNAME_KEY) || "";
  const [username, setUsername] = useState(rememberedUsername);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedUsername));
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const usernameInvalid = touched.username && username.trim() === "";
  const passwordInvalid = touched.password && password.trim() === "";

  async function handleSubmit(event) {
    event.preventDefault();
    setTouched({ username: true, password: true });
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill in both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username.trim(),
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      saveAuth(
        {
          token: data.token,
          user: data.user
        },
        rememberMe
      );
      onLogin({ token: data.token, user: data.user });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="login-panel" aria-label="Login form">
        <div className="brand-row">
          <div className="brand-mark">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="eyebrow">Assignment 7</p>
            <h1>Arina's Authentication System</h1>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="field-label" htmlFor="username">
            Username
          </label>
          <div className={`input-wrap ${usernameInvalid ? "input-error" : ""}`}>
            <User size={18} />
            <input
              id="username"
              type="text"
              value={username}
              onBlur={() => setTouched((current) => ({ ...current, username: true }))}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter username"
              aria-invalid={usernameInvalid}
            />
          </div>
          {usernameInvalid && <p className="field-error">Username is mandatory.</p>}

          <label className="field-label" htmlFor="password">
            Password
          </label>
          <div className={`input-wrap ${passwordInvalid ? "input-error" : ""}`}>
            <Lock size={18} />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onBlur={() => setTouched((current) => ({ ...current, password: true }))}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              aria-invalid={passwordInvalid}
            />
            <button
              className="icon-button"
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {passwordInvalid && <p className="field-error">Password is mandatory.</p>}

          <div className="strength-block">
            <div className="strength-header">
              <span>Password strength</span>
              <strong className={`strength-text ${passwordStrength.level}`}>
                {passwordStrength.label}
              </strong>
            </div>
            <div className="strength-track" aria-hidden="true">
              <span
                className={`strength-fill ${passwordStrength.level}`}
                style={{ width: `${Math.max(passwordStrength.score, 1) * 20}%` }}
              />
            </div>
          </div>
        <label className="remember-row">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <span>Remember Me</span>
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="demo-box">
          <p>Demo username: <strong>admin</strong></p>
          <p>Demo password: <strong>Admin@123</strong></p>
        </div>
      </section>
    </main>
  );
}

function Dashboard({ auth, onLogout }) {
  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Protected route</p>
          <h1>Dashboard</h1>
        </div>
        <button className="logout-button" type="button" onClick={onLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </header>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <p className="card-label">Signed in as</p>
          <h2>{auth.user.username}</h2>
          <p>Your login is protected by a simulated JWT token checked through the backend.</p>
        </article>

        <article className="dashboard-card">
          <p className="card-label">Token status</p>
          <h2>Valid</h2>
          <p>The dashboard appears only after the token passes validation.</p>
        </article>

        <article className="dashboard-card wide">
          <p className="card-label">Route protection</p>
          <h2>Local and deployed ready</h2>
          <p>
            If the token is missing, expired, or invalid, the app clears storage and sends the
            user back to the login screen.
          </p>
        </article>
      </section>
    </main>
  );
}

export default function App() {
  const [auth, setAuth] = useState(null);
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    async function validateStoredToken() {
      const storedAuth = getStoredAuth();

      if (!storedAuth?.token) {
        setCheckingToken(false);
        return;
      }

      try {
        const response = await fetch("/api/validate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedAuth.token}`
          },
          body: JSON.stringify({ token: storedAuth.token })
        });

        const data = await response.json();

        if (!response.ok || !data.valid) {
          throw new Error(data.message || "Invalid token");
        }

        setAuth({
          token: storedAuth.token,
          user: data.user
        });
      } catch {
        clearAuth();
      } finally {
        setCheckingToken(false);
      }
    }

    validateStoredToken();
  }, []); 
  function handleLogout() {
    clearAuth();
    setAuth(null);
  }

  if (checkingToken) {
    return (
      <main className="loading-screen">
        <ShieldCheck size={34} />
        <p>Checking secure session...</p>
      </main>
    );
  }

  if (!auth) {
    return <LoginPage onLogin={setAuth} />;
  }

  return <Dashboard auth={auth} onLogout={handleLogout} />;
}