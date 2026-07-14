import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Field from "./Field";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password, name);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: "40ch", margin: "4rem auto", padding: "0 1rem" }}>
      <h1 className="gel-great-primer-bold">Create account</h1>
      <form onSubmit={handleSubmit} noValidate>
        <Field
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
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
          autoComplete="new-password"
          description="At least 8 characters"
          minLength={8}
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
            {loading ? "Creating account…" : "Create account"}
          </button>
        </div>
        <p style={{ marginTop: "1rem" }}>
          Already have an account?{" "}
          <Link to="/login" className="gel-cta" style={{ fontSize: "inherit" }}>
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
};

export default RegisterPage;
