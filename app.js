import express from "express";
import foldersRouter from "./routes/folders.js"
import filesRouter from "./routes/files.js"

const app = express();

app.use(express.json());

app.use("/folders", foldersRouter);
app.use("/files", filesRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send({ error: err.message || "Internal Server Error" });
});

export default app;
