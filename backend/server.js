const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");

const app = express();
app.use(cors());

const PORT = 5000;

function loadCSV(path) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

app.get("/farmers", async (req, res) => {
  const data = await loadCSV("./data/growers.csv");
  res.json(data.slice(0, 50));
});

app.get("/campaigns", async (req, res) => {
  const data = await loadCSV("./data/whatsapp_campaign.csv");
  res.json(data.slice(0, 50));
});

app.get("/inventory", async (req, res) => {
  const data = await loadCSV("./data/retailer_inventory_weekly.csv");
  res.json(data.slice(0, 50));
});

app.get("/recommendations", async (req, res) => {
  const growers = await loadCSV("./data/growers.csv");

  const recommendations = growers.slice(0, 20).map((g) => ({
    grower_id: g.grower_id,
    crop: g.grower_crop_calendar,
    recommendation:
      "Recommend fungicide campaign for upcoming crop cycle",
  }));

  res.json(recommendations);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});