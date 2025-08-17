import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import {
  middlewareMetricsInc,
  middlewareLogResponses,
  middlewareErrorHandler,
} from "./api/middleware.js";
import {
  handlerLogin,
  handlerRefreshToken,
  handlerRevokeToken,
} from "./api/auth.js";
import { handlerCreateUser, handlerUpdateUser } from "./api/users.js";
import {
  handlerCreateChirp,
  handlerGetChirpById,
  handlerGetChirps,
  handlerDeleteChirp,
} from "./api/chirps.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import config from "./config.js";
import { handlerPolkaWebhooks } from "./api/polka.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);
app.post("/api/users", handlerCreateUser);
app.put("/api/users", handlerUpdateUser);
app.post("/api/polka/webhooks", handlerPolkaWebhooks);
app.post("/api/login", handlerLogin);
app.post("/api/refresh", handlerRefreshToken);
app.post("/api/revoke", handlerRevokeToken);
app.post("/api/chirps", handlerCreateChirp);
app.get("/api/chirps", handlerGetChirps);
app.get("/api/chirps/:id", handlerGetChirpById);
app.delete("/api/chirps/:id", handlerDeleteChirp);

app.use(middlewareErrorHandler);

app.listen(config.api.port, () => {
  console.log(`Server is running on port ${config.api.port}`);
});
