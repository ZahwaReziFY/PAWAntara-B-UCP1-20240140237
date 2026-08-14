// Akun admin/kasir (Sprint 2)
// Sesuai PRD: boleh hardcode/seed data, tidak perlu registrasi/lupa password.
// Password TIDAK disimpan plain text - di-hash pakai bcrypt saat server start.
// Username & password asli diambil dari .env (ADMIN_USERNAME/ADMIN_PASSWORD),
// dengan fallback default admin/admin123 supaya tetap bisa jalan tanpa .env.
const bcrypt = require("bcryptjs");

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const users = [
  {
    id: 1,
    username: ADMIN_USERNAME,
    // Hash dibuat sekali saat server start, bukan dibandingkan sebagai teks polos
    passwordHash: bcrypt.hashSync(ADMIN_PASSWORD, 10),
  },
];

module.exports = users;
