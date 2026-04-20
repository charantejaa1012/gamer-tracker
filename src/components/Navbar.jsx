import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const nav = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    nav("/login");
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px",
      background: "#111",
      color: "white"
    }}>
      <h2>🎮 Gamer Tracker</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}