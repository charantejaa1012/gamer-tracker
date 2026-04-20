import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Charts from "../components/Charts";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();

  const [matches, setMatches] = useState([]);
  const [form, setForm] = useState({
    kills: "",
    deaths: "",
    assists: "",
    map: "",
    agent: "",
    result: "win",
  });

  if (!user) return <h2>Loading...</h2>;

  const fetchMatches = async () => {
    const data = await getDocs(collection(db, "matches"));
    const filtered = data.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }))
      .filter((m) => m.userId === user.uid);

    setMatches(filtered);
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addMatch = async () => {
    // ✅ validation
    if (!form.kills || !form.deaths || !form.map || !form.agent) {
      alert("Please fill all required fields");
      return;
    }

    await addDoc(collection(db, "matches"), {
      userId: user.uid,
      ...form,
      kills: Number(form.kills),
      deaths: Number(form.deaths),
      assists: Number(form.assists),
      createdAt: new Date(),
    });

    setForm({
      kills: "",
      deaths: "",
      assists: "",
      map: "",
      agent: "",
      result: "win",
    });

    fetchMatches();
  };

  const deleteMatch = async (id) => {
    await deleteDoc(doc(db, "matches", id));
    fetchMatches();
  };

  // 📊 stats
  const totalMatches = matches.length;

  const totalKills = matches.reduce((s, m) => s + m.kills, 0);
  const totalDeaths = matches.reduce((s, m) => s + m.deaths, 0);

  const kd =
    totalDeaths === 0
      ? totalKills
      : (totalKills / totalDeaths).toFixed(1); // ✅ cleaner KD

  const wins = matches.filter((m) => m.result === "win").length;
  const winRate = totalMatches
    ? ((wins / totalMatches) * 100).toFixed(1)
    : 0;

  return (
    <div>
      <Navbar />

      <div className="container">
        <h1>🎮 Gamer Dashboard</h1>

        {/* STATS */}
        <div className="stats">
          <div>Matches: {totalMatches}</div>
          <div>K/D: {kd}</div>
          <div>Win Rate: {winRate}%</div>
        </div>

        {/* FORM */}
        <div className="form">
          <input
            type="number"
            min="0"
            name="kills"
            placeholder="Kills"
            value={form.kills}
            onChange={handleChange}
          />

          <input
            type="number"
            min="0"
            name="deaths"
            placeholder="Deaths"
            value={form.deaths}
            onChange={handleChange}
          />

          <input
            type="number"
            min="0"
            name="assists"
            placeholder="Assists"
            value={form.assists}
            onChange={handleChange}
          />

          <input
            name="map"
            placeholder="Map"
            value={form.map}
            onChange={handleChange}
          />

          <input
            name="agent"
            placeholder="Agent"
            value={form.agent}
            onChange={handleChange}
          />

          <select
            name="result"
            value={form.result}
            onChange={handleChange}
          >
            <option value="win">Win</option>
            <option value="loss">Loss</option>
          </select>

          <button onClick={addMatch}>Add Match</button>
        </div>

        {/* CHART */}
        <div className="chart-box">
          <Charts data={matches} />
        </div>

        {/* MATCH LIST */}
        <h2>Match History</h2>

        {matches.length === 0 ? (
          <p>No matches yet</p>
        ) : (
          matches.map((m) => (
            <div key={m.id} className="match">
              <span>
                {m.agent} | {m.map} | {m.kills}/{m.deaths}/{m.assists} |{" "}
                {m.result}
              </span>
              <button onClick={() => deleteMatch(m.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}