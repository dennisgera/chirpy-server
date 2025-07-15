import express from "express";

const app = express();
const PORT = 8080;

app.use("/app", express.static("./src/app"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/healthz", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.send("OK");
});
