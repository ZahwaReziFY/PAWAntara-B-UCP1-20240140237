// ===== SPRINT 2: Dashboard admin - CRUD produk lewat Fetch API =====
document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("product-table-body");
  const form = document.getElementById("product-form");
  const idField = document.getElementById("product-id");
  const nameField = document.getElementById("name");
  const categoryField = document.getElementById("category");
  const priceField = document.getElementById("price");
  const stockField = document.getElementById("stock");
  const descField = document.getElementById("description");
  const formTitle = document.getElementById("form-title");
  const submitBtn = document.getElementById("form-submit-btn");
  const cancelBtn = document.getElementById("form-cancel-btn");
  const alertBox = document.getElementById("dash-alert");
  const logoutBtn = document.getElementById("logout-btn");

  function showAlert(pesan, tipe) {
    alertBox.textContent = pesan;
    alertBox.className =
      "mt-5 text-sm rounded-lg px-4 py-2.5 " +
      (tipe === "error"
        ? "bg-red-50 border border-red-200 text-red-700"
        : "bg-green-50 border border-green-200 text-green-700");
    setTimeout(() => alertBox.classList.add("hidden"), 3500);
  }

  function formatRupiah(angka) {
    return "Rp " + Number(angka).toLocaleString("id-ID");
  }

  function resetForm() {
    form.reset();
    idField.value = "";
    formTitle.textContent = "Tambah Produk Baru";
    submitBtn.textContent = "Simpan Produk";
    cancelBtn.classList.add("hidden");
  }

  // ---- Ambil & render daftar produk ----
  async function loadProducts() {
    try {
      const res = await fetch("/api/products");
      const result = await res.json();
      renderTable(result.data || []);
    } catch (err) {
      showAlert("Gagal memuat data produk.", "error");
    }
  }

  function renderTable(produkList) {
    tableBody.innerHTML = "";

    if (produkList.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="5" class="px-4 py-6 text-center text-muted italic">Belum ada produk.</td></tr>';
      return;
    }

    produkList.forEach((p) => {
      const tr = document.createElement("tr");
      tr.className = "border-t border-accent-light";
      tr.innerHTML = `
        <td class="px-4 py-3 font-medium"></td>
        <td class="px-4 py-3"></td>
        <td class="px-4 py-3"></td>
        <td class="px-4 py-3"></td>
        <td class="px-4 py-3 text-right"></td>
      `;

      tr.children[0].textContent = p.name;
      tr.children[1].textContent =
        p.category === "sembako" ? "Sembako" : "Rumah Tangga";
      tr.children[2].textContent = formatRupiah(p.price);
      tr.children[3].textContent = p.stock;

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className =
        "bg-accent-light hover:bg-accent-light/70 text-primary-dark font-semibold px-3 py-1.5 rounded-lg text-xs mr-2";
      editBtn.addEventListener("click", () => isiFormUntukEdit(p));

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Hapus";
      deleteBtn.className =
        "bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-3 py-1.5 rounded-lg text-xs";
      deleteBtn.addEventListener("click", () => hapusProduk(p.id, p.name));

      tr.children[4].appendChild(editBtn);
      tr.children[4].appendChild(deleteBtn);

      tableBody.appendChild(tr);
    });
  }

  function isiFormUntukEdit(p) {
    idField.value = p.id;
    nameField.value = p.name;
    categoryField.value = p.category;
    priceField.value = p.price;
    stockField.value = p.stock;
    descField.value = p.description || "";

    formTitle.textContent = "Edit Produk: " + p.name;
    submitBtn.textContent = "Update Produk";
    cancelBtn.classList.remove("hidden");
    window.scrollTo({ top: form.offsetTop - 100, behavior: "smooth" });
  }

  // ---- Submit form (tambah / edit) ----
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Validasi dasar di frontend (FR-17): cegah submit kosong
    const name = nameField.value.trim();
    const category = categoryField.value;
    const price = priceField.value;
    const stock = stockField.value;

    if (!name || !category || price === "" || stock === "") {
      showAlert("Semua field wajib (nama, kategori, harga, stok) harus diisi.", "error");
      return;
    }

    const payload = {
      name,
      category,
      price: Number(price),
      stock: Number(stock),
      description: descField.value.trim(),
    };

    const isEdit = Boolean(idField.value);
    const url = isEdit ? `/api/products/${idField.value}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok || result.status !== "success") {
        showAlert(result.message || "Gagal menyimpan produk.", "error");
        return;
      }

      showAlert(result.message, "success");
      resetForm();
      loadProducts();
    } catch (err) {
      showAlert("Terjadi kesalahan koneksi ke server.", "error");
    }
  });

  cancelBtn.addEventListener("click", resetForm);

  // ---- Hapus produk ----
  async function hapusProduk(id, nama) {
    const yakin = window.confirm(`Yakin mau hapus "${nama}"?`);
    if (!yakin) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (!res.ok || result.status !== "success") {
        showAlert(result.message || "Gagal menghapus produk.", "error");
        return;
      }

      showAlert(result.message, "success");
      loadProducts();
    } catch (err) {
      showAlert("Terjadi kesalahan koneksi ke server.", "error");
    }
  }

  // ---- Logout ----
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async function () {
      try {
        await fetch("/api/logout", { method: "POST" });
      } catch (err) {
        // tetap redirect walau request gagal, biar user gak nyangkut
      }
      window.location.href = "/login";
    });
  }

  loadProducts();
});
