import db from "#db/client";

console.log("🌱 Seeding database...");

await seed();

async function seed() {
  try {
    await db.connect();

    // Inserts three folders
    const folderNames = ["Documents", "Downloads", "Applications"];
    const insertedFolders = await Promise.all(
      folderNames.map((name) =>
        db.query(
          "INSERT INTO folders (name) VALUES ($1) RETURNING *;",
          [name]
        )
      )
    );
    const folders = insertedFolders.map((result) => result.rows[0]);

    // Creates five files for each folder
    const fileData = folders.flatMap((folder) =>
      Array.from({ length: 5 }, (_, index) => ({
        name: `${folder.name}_File_${index + 1}.txt`,
        size: Math.floor(Math.random() * 1000 + 100),
        folder_id: folder.id,
      }))
    );

    // Inserts files into database
    await Promise.all(
      fileData.map((file) =>
        db.query(
          "INSERT INTO files (name, size, folder_id) VALUES ($1, $2, $3);",
          [file.name, file.size, file.folder_id]
        )
      )
    );

    console.log("Seed complete!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await db.end();
  }
}
