import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { getMe, updateMe } from "../api";
import Field from "../Field";

const ProfilePage = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "" });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMe(token).then(setProfile).catch((err) => setError(err.message));
  }, [token]);

  const startEdit = () => {
    setForm({ name: profile.name });
    setEditing(true);
  };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const updated = await updateMe(token, form);
      setProfile(updated);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <main className="app-main" id="main-content" tabIndex={-1}>
        {error ? (
          <p className="gel-form__warning" role="alert">
            {error}
          </p>
        ) : (
          <p role="status">Loading…</p>
        )}
      </main>
    );
  }

  return (
    <main className="app-main" id="main-content" tabIndex={-1}>
      <h1 className="gel-great-primer-bold">Profile</h1>

      <div className="profile">
        {profile.avatar ? (
          <img className="profile__avatar" src={profile.avatar} alt="" />
        ) : (
          <div className="profile__avatar profile__avatar--placeholder" aria-hidden="true">
            {profile.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="gel-pica-bold" style={{ margin: 0 }}>
            {profile.name}
          </p>
          <p style={{ margin: 0 }}>{profile.email}</p>
          <p style={{ margin: 0 }}>Role: {profile.role}</p>
        </div>
      </div>

      <div className="profile__points">
        <div className="evidence-card">
          <span className="evidence-status">Points</span>
          <p className="gel-great-primer-bold" style={{ margin: "0.25rem 0 0" }}>
            {profile.points}
          </p>
        </div>
        <div className="evidence-card">
          <span className="evidence-status">Lifetime points</span>
          <p className="gel-great-primer-bold" style={{ margin: "0.25rem 0 0" }}>
            {profile.lifetimePoints}
          </p>
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleSave} noValidate style={{ marginTop: "1.5rem" }}>
          <Field label="Name" value={form.name} onChange={update("name")} required />
          {error && (
            <p className="gel-form__warning" role="alert">
              {error}
            </p>
          )}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
            <button type="submit" className="gel-button" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className="gel-button"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          className="gel-button"
          style={{ marginTop: "1.5rem" }}
          onClick={startEdit}
        >
          Edit profile
        </button>
      )}
    </main>
  );
};

export default ProfilePage;
