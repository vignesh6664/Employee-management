const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Pool } = require("pg");
const { error } = require("console");

const app = express();
const port = 5000;

// Generating jwt

const secret = crypto.randomBytes(64).toString("hex");

// db

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "employee_management",
  password: "1234",
  port: 5432,
});

app.use(cors());
app.use(express.json());

// signup

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      "INSERT INTO admins (username, password) VALUES ($1, $2) ",
      [username, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login Auth

app.get("/login", async (req, res) => {
  try {
    const admin = await pool.query("SELECT * FROM admins");
    res.status(201).json(admin.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM admins WHERE username=$1", [
      username,
    ]);
    if (result.rows.length == 0) {
      return res.status(401).json({ error: "Not Found" });
    }
    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Details" });
    }
    const token = jwt.sign({ id: admin.id }, secret, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware auth token

const authToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Employee Routes

app.get("/employees", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employees");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/employees", async (req, res) => {
  const { name, email, mobile, position, gender, course, image } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO employees (name,email,mobile,position,gender,course,image) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [name, email, mobile, position, gender, course, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/employees/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, position, gender, course, image } = req.body;
  try {
    const result = await pool.query(
      "UPDATE employees SET name = $1, email = $2, mobile = $3, position = $4,gender=$5,course=$6,image=$7 WHERE id = $8 RETURNING *",
      [name, email, mobile, position, gender, course, image, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/employees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM employees WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
