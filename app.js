const express = require("express");
const cors = require("cors");
const app = express();

const meditationRoutes = require("./adapters/routes/meditationRoutes");
const songRoutes = require("./adapters/routes/songRoutes"); 

app.use(cors());
app.use(express.json());


app.use("/songs", songRoutes); 
app.use("/meditation",meditationRoutes);
const PORT = process.env.PORT||3000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
