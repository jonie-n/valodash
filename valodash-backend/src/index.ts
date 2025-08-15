import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

const agents = [
  "Brimstone", "Phoenix", "Sage", "Sova", "Viper", "Cypher", "Reyna", "Killjoy", "Breach",
  "Omen", "Jett", "Raze", "Skye", "Yoru", "Astra", "Kay/o", "Chamber", "Neon", "Fade",
  "Harbor", "Gekko", "Deadlock", "Iso", "Clove", "Vyse", "Tejo", "Waylay"
];

const maps = [
  "Abyss", "Sunset", "Lotus", "Pearl", "Fracture", "Breeze", "Icebox", "Ascent",
  "Haven", "Bind", "Split", "Corrode"
];

function generateHeadshotRate(): number {
  const base = Math.random();
  if (base < 0.1) return parseFloat((5 + Math.random() * 5).toFixed(1));      // 5–10%
  if (base < 0.4) return parseFloat((10 + Math.random() * 10).toFixed(1));    // 10–20%
  if (base < 0.9) return parseFloat((15 + Math.random() * 10).toFixed(1));    // 15–25%
  return parseFloat((25 + Math.random() * 15).toFixed(1));                    // 25–40%
}


app.post("/seed", (req, res) => {
  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: "Missing uid" });

  const dataDir = path.join(__dirname, "data");
  const filePath = path.join(dataDir, `${uid}.json`);

  // Prevent regenerating data if file already exists
  if (fs.existsSync(filePath)) {
    const existingData = fs.readFileSync(filePath, "utf-8");
    return res.json(JSON.parse(existingData));
  }

  const mockMatches = Array.from({ length: 10 }, (_, i) => ({
    matchId: `${uid}-match-${i + 1}`,
    agent: agents[Math.floor(Math.random() * agents.length)],
    map: maps[Math.floor(Math.random() * maps.length)],
    kills: Math.floor(Math.random() * 25),
    deaths: Math.floor(Math.random() * 20),
    assists: Math.floor(Math.random() * 15),
    win: Math.random() > 0.5,
    date: new Date(Date.now() - i * 86400000).toISOString(),
    headshotPercentage: generateHeadshotRate(), // ✅ ADD THIS
  }));  

  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  fs.writeFileSync(filePath, JSON.stringify({ uid, matches: mockMatches }, null, 2));

  res.json({ uid, matches: mockMatches });
});


// app.post("/seed", (req, res) => {
//   const { uid } = req.body;
//   if (!uid) return res.status(400).json({ error: "Missing uid" });

//   const mockMatches = Array.from({ length: 10 }, (_, i) => ({
//     matchId: `${uid}-match-${i + 1}`,
//     agent: ["Jett", "Reyna", "Sage", "Phoenix", "Killjoy"][Math.floor(Math.random() * 5)],
//     map: ["Ascent", "Bind", "Haven", "Split", "Lotus"][Math.floor(Math.random() * 5)],
//     kills: Math.floor(Math.random() * 20),
//     deaths: Math.floor(Math.random() * 15),
//     assists: Math.floor(Math.random() * 15),
//     win: Math.random() < 0.5,
//     date: new Date(Date.now() - i * 86400000).toISOString(), // recent dates
//   }));

//   // ✅ Ensure "data/" folder exists
//   const dataDir = path.join(__dirname, "data");
//   if (!fs.existsSync(dataDir)) {
//     fs.mkdirSync(dataDir);
//   }

//   const filePath = path.join(dataDir, `${uid}.json`);
//   fs.writeFileSync(filePath, JSON.stringify({ uid, matches: mockMatches }, null, 2));

//   res.json({ uid, matches: mockMatches });
// });


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/matches/:uid", (req, res) => {
  const { uid } = req.params;
  const filePath = path.join(__dirname, "data", `${uid}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "No match data found for this user" });
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  res.json(data);
});


