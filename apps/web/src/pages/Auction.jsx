import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { listAuctionItems, placeBid } from "../api";
import Field from "../Field";

const BidCard = ({ item, token, onRefresh }) => {
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const minimumBid =
    Number(item.currentBid ?? item.startingPrice) + 1;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (Number(amount) <= Number(item.currentBid ?? item.startingPrice)) {
      setError(
        `Bid must be greater than £${item.currentBid ?? item.startingPrice}`
      );
      return;
    }

    setBusy(true);

    try {
      await placeBid(token, item.id, {
        amount: Number(amount),
      });

      setAmount("");
      await onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="evidence-card">
      <h3>{item.title}</h3>

      <p>{item.description}</p>

      <p>
        <strong>Starting Price:</strong> £{item.startingPrice}
      </p>

      <p>
        <strong>Current Highest Bid:</strong> £
        {item.currentBid ?? item.startingPrice}
      </p>

      <form onSubmit={handleSubmit}>
        <Field
          label="Your Bid (£)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        {error && (
          <p className="gel-form__warning" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="gel-button"
          disabled={busy}
        >
          {busy ? "Placing..." : `Bid £${minimumBid}+`}
        </button>
      </form>
    </article>
  );
};

export default function AuctionPage() {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadItems = async () => {
    try {
      setError("");

      const data = await listAuctionItems(token);

      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [token]);

  return (
    <main className="app-main">
      <h1 className="gel-great-primer-bold">Auction</h1>

      {error && (
        <p className="gel-form__warning" role="alert">
          {error}
        </p>
      )}

      {loading && <p>Loading auction items...</p>}

      {!loading && items.length === 0 && (
        <p>No auction items available.</p>
      )}

      <div
        style={{
          display: "grid",
          gap: "1rem",
        }}
      >
        {items.map((item) => (
          <BidCard
            key={item.id}
            item={item}
            token={token}
            onRefresh={loadItems}
          />
        ))}
      </div>
    </main>
  );
}
 
