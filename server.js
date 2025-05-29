import app from "#app";
import db from "#db/client";

const PORT = process.env.PORT ?? 3000;

try {
  await db.connect();
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
} catch (err) {
  console.error("Failed to start server:", err.stack);
  process.exit(1);
}
