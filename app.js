const express = require("express");
const cors = require("cors");
const app = express();

// Existing route imports
const meditationRoutes = require("./adapters/routes/meditationRoutes");
const songRoutes = require("./adapters/routes/songRoutes");

// ✅ New meditation techniques route import
const meditationtechRoutes = require("./adapters/routes/meditationtechRoutes");

app.use(cors());
app.use(express.json());

// Route mappings
app.use("/songs", songRoutes);
app.use("/meditation", meditationRoutes);

// ✅ Add this line to enable /meditation/techniques
app.use("/meditation", meditationtechRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
