import express from "express";
import db from "../db/client.js";

const router = express.Router();

// GET all folders
router.get("/", async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM folders;");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET folder by ID with its files
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const folderResult = await db.query("SELECT * FROM folders WHERE id = $1;", [id]);
    if (folderResult.rows.length === 0) {
      return res.status(404).send("Folder not found");
    }

    const folder = folderResult.rows[0];

    const fileResult = await db.query("SELECT * FROM files WHERE folder_id = $1;", [id]);

    res.json({
      ...folder,
      files: fileResult.rows,
    });
  } catch (err) {
    next(err);
  }
});

// POST create new file in a folder
router.post("/:id/files", async (req, res, next) => {
  const { id } = req.params;

  // Safely extract name and size
  const { name, size } = req.body || {};

  // Validate required fields
  if (!name || !size) {
    return res.status(400).send("Missing required fields");
  }

  try {
    // Check if the folder exists
    const folderResult = await db.query("SELECT * FROM folders WHERE id = $1;", [id]);
    if (folderResult.rows.length === 0) {
      return res.status(404).send("Folder not found");
    }

    // Insert the new file
    const result = await db.query(
      "INSERT INTO files (name, size, folder_id) VALUES ($1, $2, $3) RETURNING *;",
      [name, size, id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
