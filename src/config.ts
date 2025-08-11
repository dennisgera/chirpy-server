import { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

type APIConfig = {
  port: number;
  fileServerHits: number;
  platform: string;
};

type JWTConfig = {
  secret: string;
};

type Config = {
  api: APIConfig;
  db: DBConfig;
  jwt: JWTConfig;
};

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

const config: Config = {
  api: {
    fileServerHits: 0,
    port: Number(envOrThrow("PORT")),
    platform: envOrThrow("PLATFORM"),
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig,
  },
  jwt: {
    secret: envOrThrow("JWT_SECRET"),
  },
};

export default config;
