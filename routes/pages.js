const express = require("express");
const router = express.Router();
const products = require("../data/products");
const { requireAuthPage } = require("../middleware/auth");

// ==================== SPRINT 1 ====================

// GET / -> Beranda
router.get("/", (req, res) => {
  const preview = products.slice(0, 3);
  res.render("index", {
    title: "Beranda",
    preview,
  });
});

// GET /produk -> Daftar produk + filter lewat query string (FR-06)
// Catatan Sprint 2: data dibaca langsung dari modul data/products.js yang
// SAMA dengan yang diubah oleh endpoint CRUD (bukan sumber data terpisah),
// jadi begitu admin tambah/edit/hapus produk di dashboard, halaman ini
// langsung ikut berubah tanpa restart server.
router.get("/produk", (req, res) => {
  const { kategori, search } = req.query;
  let hasil = products;

  if (kategori) {
    hasil = hasil.filter(
      (p) => p.category.toLowerCase() === kategori.toLowerCase()
    );
  }

  if (search) {
    const kata = search.toLowerCase();
    hasil = hasil.filter((p) => p.name.toLowerCase().includes(kata));
  }

  res.render("produk", {
    title: "Produk",
    products: hasil,
    kategoriAktif: kategori || "",
    searchAktif: search || "",
  });
});

// GET /produk/:id -> Detail produk (route dinamis, FR-05)
router.get("/produk/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const produk = products.find((p) => p.id === id);

  if (!produk) {
    return res.status(404).render("detail", {
      title: "Produk Tidak Ditemukan",
      produk: null,
    });
  }

  res.render("detail", {
    title: produk.name,
    produk,
  });
});

// GET /tanya-ai -> Halaman chat (balasan asli lewat POST /api/chat, Sprint 2)
router.get("/tanya-ai", (req, res) => {
  res.render("tanya-ai", { title: "Tanya AI" });
});

// ==================== SPRINT 2 ====================

// GET /login -> Halaman login admin/kasir
router.get("/login", (req, res) => {
  // Kalau sudah login, gak perlu lihat form login lagi
  if (req.session && req.session.isLoggedIn) {
    return res.redirect("/dashboard");
  }
  res.render("login", { title: "Login Admin" });
});

// GET /dashboard -> Kelola produk (WAJIB login, dilindungi middleware auth)
router.get("/dashboard", requireAuthPage, (req, res) => {
  res.render("dashboard", {
    title: "Dashboard Admin",
    username: req.session.username,
  });
});

module.exports = router;
