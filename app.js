require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const pageRoutes = require("./routes/pages");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

// ---- View engine ----
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---- Middleware bawaan ----
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ==================== SPRINT 2 ====================
// Session-based auth (FR-11, FR-12, FR-13)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "toko-ariesta-secret-dev",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2, // 2 jam
    },
  })
);

// Supaya views (navbar) tahu status login tanpa perlu dikirim manual tiap render
app.use((req, res, next) => {
  res.locals.loggedIn = Boolean(req.session && req.session.isLoggedIn);
  res.locals.username = (req.session && req.session.username) || null;
  next();
});

// ==================== SPRINT 1 ====================
// Middleware custom: request logger (FR-08, dipakai juga di Sprint 2)
app.use((req, res, next) => {
  const waktu = new Date().toLocaleString("id-ID");
  console.log(`[${waktu}] ${req.method} ${req.originalUrl}`);
  next();
});

// ---- Routes ----
app.use("/", pageRoutes);   // Beranda, Produk, Detail, Tanya AI, Login, Dashboard
app.use("/api", apiRoutes); // REST API: products CRUD, login, logout, chat

// ---- 404 fallback ----
app.use((req, res) => {
  res.status(404).render("404", { title: "Halaman Tidak Ditemukan" });
});

app.listen(PORT, () => {
  console.log(`Toko Sembako Ariesta berjalan di http://localhost:${PORT}`);
});
