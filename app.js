const express = require("express");
const path = require("path");

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

// ==================== SPRINT 1 ====================
// Middleware custom: request logger (FR-08, dipakai juga di Sprint 2)
app.use((req, res, next) => {
  const waktu = new Date().toLocaleString("id-ID");
  console.log(`[${waktu}] ${req.method} ${req.originalUrl}`);
  next();
});

// TODO SPRINT 2: tambahkan express-session / JWT middleware di sini
// TODO SPRINT 2: tambahkan middleware auth untuk proteksi dashboard & endpoint mutasi

// ---- Routes ----
app.use("/", pageRoutes);   // Sprint 1: Beranda, Produk, Detail, Tanya AI
app.use("/api", apiRoutes); // Sprint 1: GET /api/products (read-only)
// TODO SPRINT 2: tambahkan routes/dashboard.js (khusus admin, dilindungi login)

// ---- 404 fallback ----
app.use((req, res) => {
  res.status(404).render("404", { title: "Halaman Tidak Ditemukan" });
});

app.listen(PORT, () => {
  console.log(`Toko Sembako Ariesta berjalan di http://localhost:${PORT}`);
});
