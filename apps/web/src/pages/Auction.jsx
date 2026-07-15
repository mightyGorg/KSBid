import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import {
  listAuctionItems,
  listBidsForItem,
  createAuctionItem,
  updateAuctionItem,
  deleteAuctionItem,
  placeBid,
} from "../api";
import Field from "../Field";

const EMPTY_ITEM = { title: "", description: "", startingPrice: "" };

const ItemFields = ({ value, onChange, idPrefix }) => (
  <>
    <Field
      label="Title"
      value={value.title}
      onChange={onChange("title")}
      required
    />
    <Field
      label="Description"
      value={value.description}
      onChange={onChange("description")}
      multiline
      rows={4}
      required
    />
    <Field
      label="Starting Price (£)"
      value={value.startingPrice}
      onChange={onChange("startingPrice")}
      required
    />
  </>
);

//const EditItemForm = ({ token, item, onDone, onCancel }) => {
//  const [form, setForm] = useState({
//    title: item.title,
//    description: item.description,
//    startingPrice: item.startingPrice,
//  });
//  const [error, setError] = useState("");
//  const [busy, setBusy] = useState(false);
//
//  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });
//
//  const handleSubmit = async (e) => {
//    e.preventDefault();
//    setError("");
//    setBusy(true);
//    try {
//      await updateAuctionItem(token, item.id, form);
//      await onDone();
//    } catch (err) {
//      setError(err.message);
//      setBusy(false);
//    }
//  };
//
//  return (
//    <form onSubmit={handleSubmit} noValidate style={{ marginTop: "0.75rem" }}>
//      <ItemFields value={form} onChange={update} idPrefix={item.id} />
//      {error && (
//        <p className="gel-form__warning" role="alert">{error}</p>
//      )}
//      <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
//        <button type="submit" className="gel-button" disabled={busy}>
//          {busy ? "Saving…" : "Save changes"}
//        </button>
//        <button type="button" className="gel-button" onClick={onCancel}>
//          Cancel
//        </button>
//      </div>
//    </form>
//  );
//};

const BidForm = ({ token, itemId, onPlaced }) => {
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleBid = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await placeBid(token, itemId, { amount });
      setAmount("");
      await onPlaced();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleBid} noValidate style={{ marginTop: "1rem" }}>
      <Field
        label="Your bid (£)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      {error && (
        <p className="gel-form__warning" role="alert">{error}</p>
      )}
      <button type="submit" className="gel-button" disabled={busy}>
        {busy ? "Placing…" : "Place bid"}
      </button>
    </form>
  );
};

export const AuctionPage = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [bids, setBids] = useState({});
  const [form, setForm] = useState(EMPTY_ITEM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadItems = () => listAuctionItems(token).then(setItems);

  const loadBids = async (itemId) => {
    const b = await listBidsForItem(token, itemId);
    setBids((prev) => ({ ...prev, [itemId]: b }));
  };

  useEffect(() => {
    loadItems().catch((err) => setError(err.message));
  }, [token]);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await createAuctionItem(token, form);
      setForm(EMPTY_ITEM);
      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await deleteAuctionItem(token, id);
      if (editingId === id) setEditingId(null);
      await loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="app-main" id="main-content" tabIndex={-1}>
      <h1 className="gel-great-primer-bold">Auction Items</h1>
      <h2 className="gel-pica-bold">Items available for bidding</h2>
      {items.length === 0 && <p role="status">No auction items yet.</p>}

      {items.map((item) => (
        <article key={item.id} className="evidence-card">
          <div className="evidence-card__meta">
            <strong>{item.title}</strong>
            <span className="evidence-status">
              Starting at £{item.startingPrice}
            </span>
          </div>

          {editingId === item.id ? (
            <EditItemForm
              token={token}
              item={item}
              onDone={async () => {
                setEditingId(null);
                await loadItems();
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              <p>{item.description}</p>

              <h3 className="gel-minion-bold" style={{ marginTop: "1rem" }}>
                Bids
              </h3>

              <button
                type="button"
                className="gel-button"
                onClick={() => loadBids(item.id)}
                style={{ marginBottom: "0.75rem" }}
              >
                Load bids
              </button>

              {bids[item.id]?.length > 0 ? (
                <ul>
                  {bids[item.id].map((b) => (
                    <li key={b.id}>
                      £{b.amount} — {b.bidderName}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No bids yet.</p>
              )}

              <BidForm
                token={token}
                itemId={item.id}
                onPlaced={() => loadBids(item.id)}
              />

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
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
              </div>
            </>
          )}
        </article>
      ))}
    </main>
  );
};

export default AuctionPage;
 
