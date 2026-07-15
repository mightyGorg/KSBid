import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { listAuctionItems, placeBid } from "../api";

const BidForm = ({ item, token, onSuccess }) => {
  const [amount, setAmount] = useState(item.nextMinimumBid);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      await placeBid(token, item.id, Number(amount));
      await onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "1rem",
        display: "flex",
        gap: "0.75rem",
        flexWrap: "wrap",
      }}
    >
      <input
        type="number"
        min={item.nextMinimumBid}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button type="submit" className="gel-button" disabled={busy}>
        {busy ? "Bidding..." : "Place bid"}
      </button>

      {error && (
        <p role="alert" className="gel-form__warning" style={{ width: "100%" }}>
          {error}
        </p>
      )}
    </form>
  );
};

export const AuctionPage = () => {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");

    try {
      const data = await listAuctionItems(token);
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  return (
    <main className="app-main" id="main-content" tabIndex={-1}>
      <h1 className="gel-great-primer-bold">Rewards Auction</h1>

      {error && (
        <p role="alert" className="gel-form__warning">
          {error}
        </p>
      )}

      {items.length === 0 && <p role="status">No auction items available.</p>}

      {items.map((item) => (
        <article key={item.id} className="evidence-card">
          <div className="evidence-card__meta">
            <strong>{item.name}</strong>

            <span className={`evidence-status evidence-status--${item.status}`}>
              {item.status}
            </span>
          </div>
          {item.description && <p>{item.description}</p>}
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.title || "Auction item"}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
              }}
            />
          )}
          <p>
            <strong>Current bid:</strong> {item.currentBid ?? "No bids yet"}
          </p>
          <p>
            <strong>Leader:</strong> {item.leader?.name ?? "None"}
          </p>
          <p>
            <strong>Minimum next bid:</strong> {item.nextMinimumBid}
          </p>
          <p>
            <strong>Closes:</strong> {new Date(item.closesAt).toLocaleString()}
          </p>
          {item.status === "CLOSED" && item.winner && (
            <p>
              <strong>Winner:</strong> {item.winner.name}
            </p>
          )}
          {item.status === "OPEN" && (
            <BidForm item={item} token={token} onSuccess={load} />
          )}
        </article>
      ))}
    </main>
  );
};

export default AuctionPage;
