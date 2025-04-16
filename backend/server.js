const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/dinoGame", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const scoreSchema = new mongoose.Schema({
  score: Number,
  date: { type: Date, default: Date.now },
});

const Score = mongoose.model("Score", scoreSchema);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/score", async (req, res) => {
  const newScore = new Score({ score: req.body.score });
  await newScore.save();

  const highScore = await Score.find().sort({ score: -1 }).limit(1);
  res.json({ highScore: highScore[0]?.score || 0 });
});

app.get("/highscore", async (req, res) => {
  const highScore = await Score.find().sort({ score: -1 }).limit(1);
  res.json({ highScore: highScore[0]?.score || 0 });
});

app.get("/records", async (req, res) => {
    const records = await Score.find().sort({ date: -1 }).limit(10);
    res.json({ records });
  });
  
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
