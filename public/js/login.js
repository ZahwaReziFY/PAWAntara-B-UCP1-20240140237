// ===== SPRINT 2: Login form -> fetch(POST /api/login) =====
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("login-form");
  const errorBox = document.getElementById("login-error");
  const submitBtn = document.getElementById("login-submit");

  if (!form) return;

  function showError(pesan) {
    errorBox.textContent = pesan;
    errorBox.classList.remove("hidden");
  }

  function hideError() {
    errorBox.classList.add("hidden");
    errorBox.textContent = "";
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    hideError();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validasi dasar di frontend (FR-17): cegah submit kosong
    if (!username || !password) {
      showError("Username dan password wajib diisi.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Memproses...";

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (!res.ok || result.status !== "success") {
        showError(result.message || "Login gagal, coba lagi.");
        submitBtn.disabled = false;
        submitBtn.textContent = "Login";
        return;
      }

      // Login berhasil -> redirect ke dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      showError("Terjadi kesalahan koneksi ke server.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Login";
    }
  });
});
