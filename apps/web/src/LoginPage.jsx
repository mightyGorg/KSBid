import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Field from "./Field";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      style={{ maxWidth: "40ch", margin: "4rem auto", padding: "0 1rem" }}
    >
      <h1 className="gel-great-primer-bold">Sign in</h1>
      <form onSubmit={handleSubmit} noValidate>
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        {error && (
          <p className="gel-form__warning" role="alert">
            {error}
          </p>
        )}
        <div style={{ marginTop: "1.5rem" }}>
          <button
            type="submit"
            className="gel-button"
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>
        <p style={{ marginTop: "1rem" }}>
          No account?{" "}
          <Link to="/register" className="gel-cta" style={{ fontSize: "inherit" }}>
            Create one
          </Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
