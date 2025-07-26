process.loadEnvFile();

function envOrThrow(key: string) {
  const value = process.env.key;
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

type APIConfig = {
  fileserverHits: number;
  dbUrl: string;
};

const config: APIConfig = {
  fileserverHits: 0,
  dbUrl: envOrThrow("DB_URL"),
};

export default config;
