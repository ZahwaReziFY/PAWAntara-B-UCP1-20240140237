const express = require("express");
const router = express.Router();
const products = require("../data/products");

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

// GET /tanya-ai -> Halaman chat (belum ada logic balasan di Sprint 1)
router.get("/tanya-ai", (req, res) => {
  res.render("tanya-ai", { title: "Tanya AI" });
});

// ==================== SPRINT 2 (belum dikerjakan) ====================
// TODO: GET  /login      -> halaman login admin/kasir
// TODO: GET  /dashboard  -> halaman kelola produk (wajib login, pakai middleware auth)
// TODO: POST /logout     -> hapus sesi lalu redirect ke /login

module.exports = router;
