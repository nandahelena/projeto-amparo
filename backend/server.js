import express from 'express'
import sqlite3 from 'sqlite3'
import path from 'path'
import fs from 'fs'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

// DB file
const DATA_DIR = path.join(__dirname, 'data')
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
const DB_PATH = path.join(DATA_DIR, 'app.db')

const db = new (sqlite3.verbose()).Database(DB_PATH, (err) => {
  if (err) {
    console.error('Erro abrindo DB:', err)
    process.exit(1)
  }
})

// Promisified helpers
const dbRun = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) return reject(err)
    resolve(this)
  })
})
const dbGet = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) return reject(err)
    resolve(row)
  })
})

async function initDb() {
  // Create a simple users table suitable for SQLite. The repo's SQL is Postgres-specific,
  // so we create a lightweight local schema here for the backend demo.
  try {
    await dbRun(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT,
      date_of_birth TEXT,
      city TEXT,
      state TEXT,
      emergency_contact TEXT,
      emergency_phone TEXT,
      created_at TEXT
    );`)
    console.log('DB initialized at', DB_PATH)
  } catch (err) {
    console.error('Failed to initialize DB:', err)
    throw err
  }
}

const app = express()
app.use(cors())
app.use(express.json())

// Helpers
const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, fullName, dateOfBirth, city, state, emergencyContact, emergencyPhone } = req.body
    if (!email || !password || password.length < 6) {
      return res.status(400).json({ error: 'Email e senha (>=6) são obrigatórios.' })
    }

    // check existing
    const existing = await dbGet('SELECT id FROM users WHERE email = ?', [email])
    if (existing) return res.status(409).json({ error: 'Email já cadastrado' })

    const password_hash = await bcrypt.hash(password, 12)
    const created_at = new Date().toISOString()

    const result = await dbRun(
      `INSERT INTO users (email, password_hash, full_name, date_of_birth, city, state, emergency_contact, emergency_phone, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [email, password_hash, fullName || null, dateOfBirth || null, city || null, state || null, emergencyContact || null, emergencyPhone || null, created_at]
    )

    const newUserId = result.lastID
    return res.status(201).json({ id: newUserId, email })
  } catch (err) {
    console.error('Register error:', err)
    return res.status(500).json({ error: 'Erro interno' })
  }
})

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' })

    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email])
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' })

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' })

    const token = signToken({ id: user.id, email: user.email })

    // Do not return password_hash
    const userProfile = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      dateOfBirth: user.date_of_birth,
      city: user.city,
      state: user.state,
      emergencyContact: user.emergency_contact,
      emergencyPhone: user.emergency_phone,
      createdAt: user.created_at,
    }

    return res.json({ token, user: userProfile })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'Erro interno' })
  }
})

// Simple auth middleware
function authenticate(req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'Não autorizado' })
  const parts = auth.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Token inválido' })
  const token = parts[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}

// Example protected endpoint
app.get('/api/me', authenticate, async (req, res) => {
  const user = await dbGet('SELECT id, email, full_name as fullName FROM users WHERE id = ?', [req.user.id])
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })
  res.json({ user })
})

// Start server after DB init
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to start server:', err)
    process.exit(1)
  })
