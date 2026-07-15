import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { getReviewQueue, reviewEvidence } from "../api";
import Field from "../Field";

const ReviewCard = ({ token, item, onReviewed }) => {
  const [points, setPoints] = useState(10);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const review = async (decision) => {
    setError("");
    setBusy(true);
    try {
      await reviewEvidence(token, item.id, {
        decision,
        feedback: feedback || undefined,
        points: Number(points),
      });
      onReviewed(item.id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <article className="evidence-card">
      <div className="evidence-card__meta">
        <strong>
          {item.ksb?.code} · {item.title}
        </strong>
        <span className="evidence-card__author">{item.user?.name}</span>
      </div>
      <p>{item.description}</p>

      <Field
        label="Points to award"
        type="number"
        min={1}
        value={points}
        onChange={(e) => setPoints(e.target.value)}
      />
      <Field
        label="Feedback (optional)"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      {error && (
        <p className="gel-form__warning" role="alert">
          {error}
        </p>
      )}
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
        <button
          type="button"
          className="gel-button"
          disabled={busy}
          onClick={() => review("APPROVED")}
        >
          Approve
        </button>
        <button
          type="button"
          className="gel-button"
          disabled={busy}
          onClick={() => review("CHANGES_REQUESTED")}
        >
          Request changes
        </button>
        <button
          type="button"
          className="gel-button"
          disabled={busy}
          onClick={() => review("REJECTED")}
        >
          Reject
        </button>
      </div>
    </article>
  );
};

const AdminQueuePage = () => {
  const { token } = useAuth();
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getReviewQueue(token).then(setQueue).catch((err) => setError(err.message));
  }, [token]);

  const removeFromQueue = (id) =>
    setQueue((q) => q.filter((item) => item.id !== id));

  return (
    <main className="app-main" id="main-content" tabIndex={-1}>
      <h1 className="gel-great-primer-bold">Review queue</h1>
      {error && (
        <p className="gel-form__warning" role="alert">
          {error}
        </p>
      )}
      {queue.length === 0 && <p role="status">Nothing waiting for review.</p>}
      {queue.map((item) => (
        <ReviewCard
          key={item.id}
          token={token}
          item={item}
          onReviewed={removeFromQueue}
        />
      ))}
    </main>
  );
};

export default AdminQueuePage;
