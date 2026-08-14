document.addEventListener("DOMContentLoaded", function () {
  // ============================================================
  // BAGIAN 1: Validasi form filter (event handling + preventDefault)
  // Kalau search KOSONG dan kategori masih "Semua Kategori" (submit
  // kosong total), tampilkan pesan error dan batalkan submit.
  // ============================================================
  const filterForm = document.getElementById("filter-form");
  const searchInput = document.getElementById("search");
  const kategoriSelect = document.getElementById("kategori");
  const searchError = document.getElementById("search-error");

  if (filterForm) {
    filterForm.addEventListener("submit", function (e) {
      const searchKosong = searchInput.value.trim() === "";
      const kategoriKosong = kategoriSelect.value === "";

      if (searchKosong && kategoriKosong) {
        e.preventDefault();
        searchError.classList.remove("hidden");
        searchInput.classList.add("ring-2", "ring-red-400");
        searchInput.focus();
        return;
      }

      searchError.classList.add("hidden");
      searchInput.classList.remove("ring-2", "ring-red-400");
    });

    searchInput.addEventListener("input", function () {
      if (searchInput.value.trim() !== "") {
        searchError.classList.add("hidden");
        searchInput.classList.remove("ring-2", "ring-red-400");
      }
    });

    kategoriSelect.addEventListener("change", function () {
      if (kategoriSelect.value !== "") {
        searchError.classList.add("hidden");
        searchInput.classList.remove("ring-2", "ring-red-400");
      }
    });
  }

  // ============================================================
  // BAGIAN 2: DOM manipulation terhadap hasil produk yang sudah
  // di-render server. Filter tetap diproses di server (FR-06) —
  // JS di sini cuma MEMPERKAYA tampilan HTML yang sudah ada, bukan
  // mengambil ulang data lewat fetch.
  // ============================================================
  const hasilGrid = document.getElementById("hasil-grid");
  const hasilCount = document.getElementById("hasil-count");

  if (hasilGrid && hasilCount) {
    // 2a. Hitung & tampilkan jumlah produk yang sedang ditampilkan
    const cards = hasilGrid.querySelectorAll(".product-card");
    hasilCount.textContent = `Menampilkan ${cards.length} produk`;

    // 2b. Highlight kata kunci pencarian di nama produk
    const kataKunci = searchInput ? searchInput.value.trim() : "";
    if (kataKunci) {
      const regexAman = kataKunci.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp("(" + regexAman + ")", "gi");

      hasilGrid.querySelectorAll(".product-name").forEach(function (el) {
        el.innerHTML = el.textContent.replace(
          regex,
          '<mark class="bg-accent text-white rounded px-0.5">$1</mark>'
        );
      });
    }
  }
});