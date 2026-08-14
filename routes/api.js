const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const products = require("../data/products");
const users = require("../data/users");
const { requireAuthApi } = require("../middleware/auth");

// ==================== SPRINT 1 ====================

// GET /api/products -> Semua produk (publik)
router.get("/products", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Data produk berhasil diambil",
    data: products,
  });
});

// ==================== SPRINT 2 ====================

// ---------- Auth ----------

// POST /api/login -> Validasi kredensial, buat sesi (FR-11)
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: "error",
      message: "Username dan password wajib diisi",
    });
  }

  const user = users.find((u) => u.username === username);
  const passwordCocok = user && bcrypt.compareSync(password, user.passwordHash);

  if (!user || !passwordCocok) {
    return res.status(401).json({
      status: "error",
      message: "Username atau password salah",
    });
  }

  req.session.isLoggedIn = true;
  req.session.username = user.username;

  res.status(200).json({
    status: "success",
    message: "Login berhasil",
  });
});

// POST /api/logout -> Hapus sesi login (FR-13, wajib login)
router.post("/logout", requireAuthApi, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal logout, coba lagi",
      });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({
      status: "success",
      message: "Logout berhasil",
    });
  });
});

// ---------- Produk (CRUD, FR-09) ----------

// GET /api/products/:id -> Ambil 1 produk (publik)
router.get("/products/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const produk = products.find((p) => p.id === id);

  if (!produk) {
    return res.status(404).json({
      status: "error",
      message: "Produk tidak ditemukan",
    });
  }

  res.status(200).json({
    status: "success",
    data: produk,
  });
});

// POST /api/products -> Tambah produk baru (wajib login)
router.post("/products", requireAuthApi, (req, res) => {
  const { name, category, price, stock, description } = req.body;

  if (!name || !category || price == null || stock == null) {
    return res.status(400).json({
      status: "error",
      message: "Field name, category, price, dan stock wajib diisi",
    });
  }

  const hargaValid = Number(price);
  const stokValid = Number(stock);

  if (Number.isNaN(hargaValid) || Number.isNaN(stokValid)) {
    return res.status(400).json({
      status: "error",
      message: "Price dan stock harus berupa angka",
    });
  }

  const idBaru =
    products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

  const produkBaru = {
    id: idBaru,
    name,
    category,
    price: hargaValid,
    stock: stokValid,
    description: description || "",
  };

  products.push(produkBaru);

  res.status(201).json({
    status: "success",
    message: "Produk ditambahkan",
    data: produkBaru,
  });
});

// PUT /api/products/:id -> Update produk (wajib login)
router.put("/products/:id", requireAuthApi, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const produk = products.find((p) => p.id === id);

  if (!produk) {
    return res.status(404).json({
      status: "error",
      message: "Produk tidak ditemukan",
    });
  }

  const { name, category, price, stock, description } = req.body;

  if (name !== undefined) produk.name = name;
  if (category !== undefined) produk.category = category;
  if (description !== undefined) produk.description = description;

  if (price !== undefined) {
    const hargaValid = Number(price);
    if (Number.isNaN(hargaValid)) {
      return res.status(400).json({
        status: "error",
        message: "Price harus berupa angka",
      });
    }
    produk.price = hargaValid;
  }

  if (stock !== undefined) {
    const stokValid = Number(stock);
    if (Number.isNaN(stokValid)) {
      return res.status(400).json({
        status: "error",
        message: "Stock harus berupa angka",
      });
    }
    produk.stock = stokValid;
  }

  res.status(200).json({
    status: "success",
    message: "Produk diperbarui",
    data: produk,
  });
});

// DELETE /api/products/:id -> Hapus produk (wajib login)
router.delete("/products/:id", requireAuthApi, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: "Produk tidak ditemukan",
    });
  }

  products.splice(index, 1);

  res.status(200).json({
    status: "success",
    message: "Produk dihapus",
  });
});

// ---------- Tanya AI (FR-14, dummy - bukan API eksternal) ----------

// POST /api/chat -> Balasan dummy berbasis keyword matching
router.post("/chat", (req, res) => {
  const { pertanyaan } = req.body;

  if (!pertanyaan || !pertanyaan.trim()) {
    return res.status(400).json({
      status: "error",
      message: "Pertanyaan tidak boleh kosong",
    });
  }

  const teks = pertanyaan.toLowerCase();
  let reply;

  if (teks.includes("jam") || teks.includes("buka") || teks.includes("tutup")) {
    reply = "Toko kami buka setiap hari jam 07.00 - 20.00!";
  } else if (
    teks.includes("ongkir") ||
    teks.includes("antar") ||
    teks.includes("kirim")
  ) {
    reply =
      "Kami melayani antar untuk area sekitar toko. Ongkir tergantung jarak, mulai dari Rp5.000.";
  } else if (
    teks.includes("bayar") ||
    teks.includes("pembayaran") ||
    teks.includes("transfer") ||
    teks.includes("cod")
  ) {
    reply = "Pembayaran bisa lewat tunai di toko, transfer bank, atau COD untuk area dekat.";
  } else if (
    teks.includes("stok") ||
    teks.includes("ready") ||
    teks.includes("ada ga") ||
    teks.includes("tersedia")
  ) {
    reply =
      "Untuk cek stok produk tertentu, silakan lihat halaman Produk ya, datanya selalu ter-update!";
  } else if (teks.includes("halo") || teks.includes("hai") || teks.includes("hello")) {
    reply = "Halo juga! Ada yang bisa dibantu seputar Toko Sembako Ariesta?";
  } else {
    reply =
      "Maaf, aku belum paham pertanyaanmu. Coba tanya soal jam buka, ongkir, pembayaran, atau stok ya!";
  }

  res.status(200).json({
    status: "success",
    data: { reply },
  });
});

module.exports = router;