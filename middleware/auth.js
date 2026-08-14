// Middleware auth (Sprint 2)
// Melindungi halaman dashboard & endpoint mutasi produk (POST/PUT/DELETE).

// Untuk route HALAMAN (server-rendered) -> kalau belum login, redirect ke /login
function requireAuthPage(req, res, next) {
  if (req.session && req.session.isLoggedIn) {
    return next();
  }
  return res.redirect("/login");
}

// Untuk route API -> kalau belum login, balas 401 JSON (bukan redirect)
function requireAuthApi(req, res, next) {
  if (req.session && req.session.isLoggedIn) {
    return next();
  }
  return res.status(401).json({
    status: "error",
    message: "Unauthorized, silakan login terlebih dahulu",
  });
}

module.exports = { requireAuthPage, requireAuthApi };
