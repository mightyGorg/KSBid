import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

const HomePage = () => {
  const { isAdmin } = useAuth();

  return (
    <main className="app-main" id="main-content" tabIndex={-1}>
      <h1 className="gel-great-primer-bold">Welcome to KSBid</h1>
      <p>Track your KSB evidence and points.</p>

      <div className="home-grid">
        <Link to="/evidence" className="home-card">
          <h2 className="gel-pica-bold">My evidence</h2>
          <p>Add, edit and submit evidence for review.</p>
        </Link>
        <Link to="/profile" className="home-card">
          <h2 className="gel-pica-bold">Profile</h2>
          <p>View your points and update your details.</p>
        </Link>
        {isAdmin && (
          <Link to="/admin/queue" className="home-card">
            <h2 className="gel-pica-bold">Review queue</h2>
            <p>Approve or reject submitted evidence.</p>
          </Link>
        )}
      </div>
    </main>
  );
};

export default HomePage;
