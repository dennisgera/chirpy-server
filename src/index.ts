import express from "express";
import config from "./config.js";

const app = express();
const PORT = 8080;

const middlewareMetricsInc = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  config.fileserverHits++;
  next();
};

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

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.use(middlewareLogResponses);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/healthz", (req: express.Request, res: express.Response) => {
  res.set("Content-Type", "text/plain");
  res.send("OK");
});

app.get("/metrics", (req: express.Request, res: express.Response) => {
  res.set("Content-Type", "text/plain");
  res.send(`Hits: ${config.fileserverHits}`);
});

app.get("/reset", (req: express.Request, res: express.Response) => {
  config.fileserverHits = 0;
  res.send("OK");
});
