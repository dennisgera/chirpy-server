import express from "express";

const app = express();
const PORT = 8080;

app.use("/app", express.static("./src/app"));

const middlewareLogResponses = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  res.on("finish", () => {
    if (res.statusCode >= 400) {
      console.log(
        `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`
      );
    }
  });
  next();
};

app.use(middlewareLogResponses);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/healthz", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.send("OK");
});
