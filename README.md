TOKO SEMBAKO ARIESTA

Nama: ZAHWA REZI FADHILAH YASYFI'
NIM: 20240140237

Deskripsi Project

Website Toko Sembako Ariesta dibangun dengan Node.js + Express.js,
memakai EJS sebagai view engine dan partials untuk navbar/footer.
Sprint 1 ini fokus pada fondasi: struktur halaman semantik, layout
responsif, routing dinamis, filter produk lewat query string, dan satu
endpoint REST API read-only (`GET /api/products`). Autentikasi, CRUD
penuh, serta logic balasan Tanya AI baru dikerjakan di Sprint 2.

## Cara Menjalankan Project Secara Lokal
```bash
npm install
npm run dev     # menjalankan server via nodemon (auto-restart)
```
Server berjalan di `http://localhost:3000`.


Struktur Folder
UTS PAW
├── data/
│   └── products.js         # data produk dummy (in-memory)
├── public/
│   ├── css/
│   │   └── style.css        # custom CSS kecil (animasi hamburger), sisanya Tailwind
│   └── js/
│       └── main.js           # hamburger toggle + form Tanya AI (lokal)
├── views/
│   ├── partials/
│   │   ├── header.ejs        # <head> meta, title, link CSS
│   │   ├── navbar.ejs         # navbar + tombol hamburger
│   │   └── footer.ejs
│   ├── index.ejs              # Beranda
│   ├── produk.ejs             # Daftar produk + filter
│   ├── detail.ejs             # Detail produk (route dinamis)
│   ├── tanya-ai.ejs
│   └── 404.ejs
├── routes/
│   ├── pages.js               # route halaman (server-rendered EJS)
│   └── api.js                  # route REST API
├── app.js                      # entry point Express
├── package.json
├── .gitignore
└── README.md

Daftar Endpoint (Sprint 1)

| Method | Endpoint          | Deskripsi                                   | Akses  |
| ------ | ------------------ | -------------------------------------------- | ------ |
| GET    | `/`                | Halaman beranda                              | Publik |
| GET    | `/produk`          | Daftar produk, mendukung `?kategori=` & `?search=` | Publik |
| GET    | `/produk/:id`      | Detail 1 produk berdasarkan ID               | Publik |
| GET    | `/tanya-ai`        | Halaman chat (tampilan saja, belum ada logic balasan) | Publik |
| GET    | `/api/products`    | Ambil seluruh data produk dalam format JSON  | Publik |

Contoh response `GET /api/products`:

```json
{
  "status": "success",
  "message": "Data produk berhasil diambil",
  "data": [
    { "id": 1, "name": "Beras Pandan Wangi 5kg", "category": "sembako", "price": 65000, "stock": 20 }
  ]
}
```

Penjelasan Tampilan (UI)

- Palet warna: krem hangat sebagai latar, hijau tua muted sebagai warna
  utama, dan terracotta sebagai warna aksen — dipilih agar terasa hangat
  dan cocok dengan tema toko sembako, tanpa warna-warna RGB/neon yang
  terlalu mencolok, namun tetap ada kontras supaya tidak monoton.
- Beranda: hero section dengan ajakan ke halaman produk, preview 3
  produk, dan bagian "kenapa belanja di sini".
- Produk: daftar produk dalam grid kartu (CSS Grid), dilengkapi form
  filter kategori & pencarian nama yang diproses di server lewat query
  string.
- Detail Produk: halaman route dinamis `/produk/:id`, menampilkan
  pesan "Produk Tidak Ditemukan" yang rapi jika ID tidak valid.
- Tanya AI: tampilan chat bubble + form; submit form sudah
  menampilkan bubble pertanyaan pengguna secara lokal (tanpa reload),
  namun balasan otomatis dari server baru aktif di Sprint 2.
- Navbar: sama di semua halaman lewat partial, dengan menu hamburger
  fungsional (vanilla JS, `addEventListener` + toggle class) yang aktif
  di lebar layar mobile.
- Styling: Tailwind CDN (Play CDN, `<script src="https://cdn.tailwindcss.com">`)
  dengan config warna custom di `views/partials/header.ejs` (palet krem,
  hijau `primary`, terracotta `accent` — bukan warna default Tailwind)
  supaya tidak "mencolok" ala RGB neon. Layout pakai utility class
  Tailwind: `flex` untuk navbar/footer/info-section, `grid` untuk kartu
  produk. Responsif pakai breakpoint bawaan Tailwind `sm:` (≥640px) dan
  `lg:` (≥1024px) — grid produk berubah dari 1 kolom (mobile) → 2 kolom
  (tablet) → 3 kolom (desktop). `public/css/style.css` cuma dipakai
  untuk 1 hal kecil yang belum di-cover utility class: animasi 3 garis
  hamburger berubah jadi ikon silang saat dibuka.

## Catatan

- Data produk masih berupa array dummy di `data/products.js` — belum
  memakai database (baru dikerjakan di Sprint 2).
- Tidak ada pemanggilan API AI eksternal apa pun.
