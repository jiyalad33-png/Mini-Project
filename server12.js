const express = require("express");
const mysql = require("mysql2/promise");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const path = require("path");
app.get("/",(req, res) => {
  res.sendFile(path.join(__dirname, "P12.html"));
});

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Jiya@3012", // Add your MySQL password here
  database: "cricket_db"
});

// Show all matches
app.get("/matches", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM matches");
  res.json(rows);
});

// Add a match
app.post("/matches", async (req, res) => {
  const { team1, team2 } = req.body;
  if (!team1 || !team2 || team1.trim() === team2.trim()) {
    return res.status(400).json({ message: "Enter two different teams." });
  }
  await db.execute(
    "INSERT INTO matches (team1, team2) VALUES (?, ?)",
    [team1.trim(), team2.trim()]
  );
  res.json({ message: "Match added!" });
});

// Update score
app.put("/matches/:id", async (req, res) => {
  const { runs, wickets, overs } = req.body;
  if ([runs, wickets, overs].some(v => !Number.isInteger(Number(v)) || Number(v) < 0) ||
      Number(wickets) > 10) {
    return res.status(400).json({ message: "Enter a valid score." });
  }
  const [result] = await db.execute(
    "UPDATE matches SET runs=?, wickets=?, overs=? WHERE id=?",
    [runs, wickets, overs, req.params.id]
  );
  if (!result.affectedRows) return res.status(404).json({ message: "Match not found." });
  res.json({ message: "Score updated!" });
});

app.listen(3000, () => console.log("Open http://localhost:3000"));
