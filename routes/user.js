import express from "express";
import pool from "../helpers/database.js";
import bcrypt from "bcrypt";

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
    const hashedPassword = await bcrypt.hash(password, 10);

    const sqlQuery = `INSERT INTO user (email, password) VALUES (?, ?)`;
    const result = await pool.query(sqlQuery, [email, hashedPassword]);

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

router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;
    const sqlQuery = `SELECT id, password FROM user WHERE email = ?`;
    const rows = await pool.query(sqlQuery, email);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({ valid_password: isPasswordValid});
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
