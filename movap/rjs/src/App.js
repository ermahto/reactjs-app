import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { api } from "./app/api";

function LoginPage({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Movie Library Login</h2>
        <input placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="login-error">{error}</p>}
        <button
          disabled={loading}
          onClick={async () => {
            try {
              setLoading(true);
              setError("");
              const { data } = await api.post("/auth/login", {
                username: name.trim(),
                password: password.trim()
              });
              onLogin(data);
              navigate(data.role === "ADMIN" ? "/admin" : "/app");
            } catch (e) {
              setError(e?.response?.data?.message || "Login failed");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}


function App() {
  const [session, setSession] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={setSession} />} />
      <Route
        path="/app"
        element={
          session ? (
            // <AppShell session={session} onLogout={() => setSession(null)} />
            <hi>Login success...!</hi>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/admin"
        element={
          session && session.role === "ADMIN" ? (
            // <AppShell session={session} onLogout={() => setSession(null)} />
             <hi>Admin logic!</hi>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
