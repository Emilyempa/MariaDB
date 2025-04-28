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

router.post("/register", async function (req, res) {
  try {
    const { email, password } = req.body;
    console.log("Received data:", { email, password }); 
    const sqlQuery = `INSERT INTO user (email, password) VALUES (?, ?)`;
    const result = await pool.query(sqlQuery, [email, password]);
    res.status(201).json({userId: result.insertId});
  } catch (error) {
    console.error("Database error:", error); 
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: error.message }); 
    }
  }
});

export default router;
