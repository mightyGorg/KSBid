import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import {
  listKsbs,
  listEvidence,
  createEvidence,
  updateEvidence,
  deleteEvidence,
  submitEvidence,
} from "../api";
import Field from "../Field";

const EMPTY = { ksbId: "", title: "", description: "" };
const SUBMITTABLE = ["DRAFT", "CHANGES_REQUESTED"];

const EvidenceFields = ({ ksbs, value, onChange, idPrefix }) => (
  <>
    <div className="gel-form__divider">
      <label htmlFor={`${idPrefix}-ksb`}>KSB</label>
      <select
        id={`${idPrefix}-ksb`}
        value={value.ksbId}
        onChange={onChange("ksbId")}
        required
      >
        <option value="">Select a KSB…</option>
        {ksbs.map((k) => (
          <option key={k.id} value={k.id}>
            {k.code} — {k.description}
          </option>
        ))}
      </select>
    </div>
    <Field label="Title" value={value.title} onChange={onChange("title")} required />
    <Field
      label="Description"
      value={value.description}
      onChange={onChange("description")}
      multiline
      rows={5}
      required
    />
  </>
);

const EditEvidenceForm = ({ token, ksbs, item, onDone, onCancel }) => {
  const [form, setForm] = useState({
    ksbId: item.ksbId,
    title: item.title,
    description: item.description,
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await updateEvidence(token, item.id, form);
      await onDone();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ marginTop: "0.75rem" }}>
      <EvidenceFields ksbs={ksbs} value={form} onChange={update} idPrefix={item.id} />
      {error && (
        <p className="gel-form__warning" role="alert">
          {error}
        </p>
      )}
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
        <button type="submit" className="gel-button" disabled={busy}>
          {busy ? "Saving…" : "Save changes"}
        </button>
        <button type="button" className="gel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

const EvidencePage = () => {
  const { token } = useAuth();
  const [ksbs, setKsbs] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => listEvidence(token).then(setEvidence);

  useEffect(() => {
    Promise.all([listKsbs(token), listEvidence(token)])
      .then(([k, e]) => {
        setKsbs(k);
        setEvidence(e);
      })
      .catch((err) => setError(err.message));
  }, [token]);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await createEvidence(token, form);
      setForm(EMPTY);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await deleteEvidence(token, id);
      if (editingId === id) setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (id) => {
    setError("");
    try {
      await submitEvidence(token, id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="app-main" id="main-content" tabIndex={-1}>
      <h1 className="gel-great-primer-bold">My evidence</h1>

      <form onSubmit={handleCreate} noValidate style={{ marginBottom: "2.5rem" }}>
        <EvidenceFields ksbs={ksbs} value={form} onChange={update} idPrefix="new" />
        {error && (
          <p className="gel-form__warning" role="alert">
            {error}
          </p>
        )}
        <div style={{ marginTop: "1.5rem" }}>
          <button type="submit" className="gel-button" disabled={busy}>
            {busy ? "Saving…" : "Add evidence"}
          </button>
        </div>
      </form>

      <h2 className="gel-pica-bold">Submitted &amp; drafts</h2>
      {evidence.length === 0 && <p role="status">No evidence yet.</p>}
      {evidence.map((item) => (
        <article key={item.id} className="evidence-card">
          <div className="evidence-card__meta">
            <strong>
              {item.ksb?.code} · {item.title}
            </strong>
            <span className={`evidence-status evidence-status--${item.status}`}>
              {item.status}
            </span>
          </div>

          {editingId === item.id ? (
            <EditEvidenceForm
              token={token}
              ksbs={ksbs}
              item={item}
              onDone={async () => {
                setEditingId(null);
                await load();
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              <p>{item.description}</p>
              {item.feedback && (
                <p className="gel-form__warning">Reviewer feedback: {item.feedback}</p>
              )}
              {item.status === "APPROVED" && (
                <p>Awarded {item.pointsAwarded} points.</p>
              )}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                {SUBMITTABLE.includes(item.status) && (
                  <button
                    type="button"
                    className="gel-button"
                    onClick={() => handleSubmit(item.id)}
                  >
                    Submit for review
                  </button>
                )}
                {item.status === "DRAFT" && (
                  <>
                    <button
                      type="button"
                      className="gel-button"
                      onClick={() => setEditingId(item.id)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="gel-button"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </article>
      ))}
    </main>
  );
};

export default EvidencePage;
