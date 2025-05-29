import express from "express";
import db from "../db/client.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT files.*, folders.name AS folder_name
      FROM files
      JOIN folders ON files.folder_id = folders.id
    `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

export default router;
