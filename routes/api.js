const express = require("express");
const router = express.Router();
const products = require("../data/products");

// ==================== SPRINT 1 ====================
// GET /api/products -> Semua produk (read-only, FR-07)
router.get("/products", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Data produk berhasil diambil",
    data: products,
  });
});

// ==================== SPRINT 2 (belum dikerjakan) ====================
// TODO: GET    /api/products/:id  -> ambil 1 produk (publik)
// TODO: POST   /api/products      -> tambah produk (wajib login)
// TODO: PUT    /api/products/:id  -> update produk (wajib login)
// TODO: DELETE /api/products/:id  -> hapus produk (wajib login)
// TODO: POST   /api/login         -> validasi kredensial admin, buat sesi
// TODO: POST   /api/logout        -> hapus sesi login
// TODO: POST   /api/chat          -> logic balasan AI dummy (keyword matching)

module.exports = router;