import express from "express";
import pool from "../helpers/database.js";

const router = express.Router();

router.get("/:id", async function (req, res) {
  try {
    const sqlQuery = `SELECT id, email, password FROM user WHERE id = ?`;
    const rows = await pool.query(sqlQuery, req.params.id);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
