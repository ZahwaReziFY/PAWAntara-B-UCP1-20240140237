# Toko Sembako Ariesta 

Nama: ZAHWA REZI FADHILAH YASYFI'
NIM: 20240140237

## Deskripsi Project

Website Toko Sembako Ariesta dibangun dengan **Node.js + Express.js**,
memakai **EJS** sebagai view engine dan partials untuk header/navbar/footer.
Sprint 1 membangun fondasi (halaman, layout, routing dinamis, filter
produk, endpoint baca produk). Sprint 2 melengkapi jadi full stack:
**login admin/kasir dengan session**, **REST API CRUD penuh** untuk
produk, **dashboard admin** yang konsumsi API lewat Fetch API, dan
**endpoint Tanya AI** dengan logika balasan dummy (keyword matching) di
backend — bukan API AI eksternal.

## Cara Menjalankan Project Secara Lokal
npm install
npm run dev    
Server berjalan di `http://localhost:3000`.

File `.env` sudah disertakan supaya project langsung bisa dijalankan
tanpa setup tambahan (isinya kredensial dummy untuk keperluan tugas,
lihat `.env.example` untuk referensi variabelnya).

### Kredensial Login Admin (untuk pengecekan asisten)

| Username | Password |
| -------- | -------- |
| `admin`  | `admin123` |

Password ini di-hash pakai **bcrypt** sebelum dibandingkan saat login
(lihat `data/users.js`) tidak dibandingkan sebagai teks polos.

## Struktur Folder
```
UTS PAW/
├── data/
│   ├── products.js          # data produk (in-memory, dipakai bareng oleh
│   │                          #   halaman publik & endpoint CRUD)
│   └── users.js              # akun admin, password di-hash bcrypt
├── middleware/
│   └── auth.js                # requireAuthPage & requireAuthApi (Sprint 2)
├── public/
│   ├── css/
│   │   └── style.css          # custom CSS kecil (animasi hamburger), sisanya Tailwind
│   └── js/
│       ├── main.js             # hamburger toggle + form Tanya AI (fetch /api/chat)
│       ├── login.js            # form login (fetch /api/login)
│       ├── dashboard.js        # CRUD produk & logout (fetch, dashboard admin)
│       └── produk.js           # validasi form filter + DOM manipulation di halaman Produk
├── routes/
│   ├── pages.js                 # route halaman, termasuk /login & /dashboard
│   └── api.js                    # REST API: auth, CRUD produk, chat
├── views/
│   ├── partials/
│   │   ├── header.ejs          # <head> meta, title, Tailwind CDN
│   │   ├── navbar.ejs           # navbar + hamburger + link Login/Dashboard dinamis
│   │   └── footer.ejs
│   ├── index.ejs                # Beranda
│   ├── produk.ejs               # Daftar produk + filter + validasi + DOM manipulation
│   ├── detail.ejs               # Detail produk (route dinamis)
│   ├── tanya-ai.ejs
│   ├── login.ejs                # Sprint 2
│   ├── dashboard.ejs            # Sprint 2, dilindungi requireAuthPage
│   └── 404.ejs
├── app.js                        # entry point Express (+ session, dotenv)
├── package.json
├── package-lock.json
├── .env                           # kredensial & secret (di-gitignore, disertakan untuk grading)
├── .env.example                   # contoh variabel .env
├── .gitignore
└── README.md
```

## Daftar Endpoint API

| Method | Endpoint             | Deskripsi                                              | Akses  | Sprint |
| ------ | ---------------------- | -------------------------------------------------------- | ------ | ------ |
| POST   | `/api/login`           | Login admin/kasir, membuat sesi                          | Publik | 2 |
| POST   | `/api/logout`          | Logout, menghapus sesi                                   | Login  | 2 |
| GET    | `/api/products`        | Ambil seluruh data produk                                 | Publik | 1 |
| GET    | `/api/products/:id`    | Ambil satu produk berdasarkan ID                          | Publik | 2 |
| POST   | `/api/products`        | Tambah produk baru                                        | Login  | 2 |
| PUT    | `/api/products/:id`    | Update produk (harga/stok/dll) berdasarkan ID              | Login  | 2 |
| DELETE | `/api/products/:id`    | Hapus produk berdasarkan ID                                | Login  | 2 |
| POST   | `/api/chat`             | Kirim pertanyaan, terima balasan AI dummy dari backend    | Publik | 2 |

Endpoint dengan akses **Login** menolak request tanpa sesi login dengan
response `{ "status": "error", "message": "Unauthorized, silakan login terlebih dahulu" }`
dan HTTP status `401` sudah diuji lewat Thunder Client tanpa cookie sesi.

### Daftar Halaman (Server-Rendered)

| Method | Route          | Deskripsi                                    | Akses  |
| ------ | -------------- | ---------------------------------------------- | ------ |
| GET    | `/`            | Beranda                                        | Publik |
| GET    | `/produk`      | Daftar produk (`?kategori=`, `?search=`)        | Publik |
| GET    | `/produk/:id`  | Detail produk                                   | Publik |
| GET    | `/tanya-ai`    | Halaman chat                                    | Publik |
| GET    | `/login`       | Form login admin                                | Publik |
| GET    | `/dashboard`   | Kelola produk (tambah/edit/hapus)               | **Login** |

## Penjelasan Fitur Sprint 2

- **Login & Session**: `POST /api/login` memvalidasi username & password
  (dibandingkan lewat `bcrypt.compareSync`, bukan teks polos), lalu
  membuat sesi dengan `express-session`. Sesi disimpan di cookie
  `httpOnly` selama 2 jam.
- **Middleware Auth** (`middleware/auth.js`): ada 2 varian —
  `requireAuthPage` (redirect ke `/login` untuk halaman) dan
  `requireAuthApi` (balas 401 JSON untuk endpoint API).
- **CRUD Produk**: `GET` publik, `POST/PUT/DELETE` wajib login &
  divalidasi di server (dicoba langsung tanpa cookie tetap ditolak 401,
  bukan cuma disembunyikan di frontend).
- **Konsistensi data**: dashboard admin dan halaman publik `/produk`
  membaca dari modul `data/products.js` yang sama, jadi begitu admin
  ubah data, halaman publik langsung ikut berubah tanpa restart server.
- **Dashboard Admin**: form tambah/edit produk + tabel produk, semuanya
  lewat `fetch()` + `async/await` (`public/js/dashboard.js`), update DOM
  tanpa reload halaman.
- **Tanya AI**: `POST /api/chat` mencocokkan kata kunci (jam buka,
  ongkir, pembayaran, stok, sapaan) lalu balas dari backend — bukan
  hardcode di frontend. Frontend (`main.js`) manggil endpoint ini lewat
  `fetch` + `async/await`.
- **Validasi & DOM manipulation di halaman Produk** (`public/js/produk.js`):
  - Kalau form filter di-submit dalam keadaan kosong total (search
    kosong DAN kategori "Semua Kategori"), submit dibatalkan
    (`preventDefault()`) dan muncul pesan "Nama produk harus diisi"
    kalau salah satu diisi (search saja atau kategori saja), filter
    tetap jalan normal ke server.
  - Setelah hasil produk di-render server, JS menghitung jumlah kartu
    produk yang tampil dan menampilkan teks "Menampilkan X produk", serta
    meng-highlight kata kunci pencarian pada nama produk pakai `<mark>`.
    Ini murni manipulasi DOM terhadap HTML yang sudah di-render server
    filter tetap diproses di server sesuai FR-06, JS di sini cuma
    memperkaya tampilannya.
- **Validasi Input**: form login, form produk (dashboard), form Tanya
  AI, dan form filter produk semuanya cegah submit kosong di sisi
  frontend sebelum request dikirim.
- **Middleware custom tambahan** (di luar auth): request logger di
  `app.js` (aktif sejak Sprint 1, tetap dipakai di Sprint 2) mencatat
  method + endpoint + waktu tiap request masuk ke terminal.

## Penjelasan Tampilan (UI)

- **Palet warna**: krem hangat, hijau tua muted, terracotta custom
  lewat `tailwind.config` di `views/partials/header.ejs`, bukan warna
  default Tailwind, supaya gak "mencolok" ala RGB/neon.
- **Styling**: **Tailwind CDN**. Layout pakai `flex` (navbar, footer,
  form) dan `grid` (kartu produk, tabel dashboard responsif). Breakpoint
  `sm:`/`md:`/`lg:` bawaan Tailwind dipakai di banyak tempat: grid
  produk 1→2→3 kolom, navbar hamburger di mobile, form detail & chat
  yang stack vertikal di layar kecil.
- **Navbar dinamis**: menampilkan link "Login" kalau belum login, atau
  "Dashboard" kalau sudah login dikirim lewat `res.locals.loggedIn`
  dari `app.js` supaya semua halaman otomatis tahu status sesi.

## Sudah Diuji

Seluruh alur berikut sudah dites langsung (bukan cuma ditulis):
akses `/dashboard` & `POST/PUT/DELETE /api/products` tanpa login
ditolak → login salah ditolak → login benar berhasil bikin sesi →
`/dashboard` bisa diakses → tambah produk via API → produk baru
langsung muncul di halaman publik `/produk` → update & hapus produk
berhasil → `POST /api/chat` membalas sesuai kata kunci → logout
menghapus sesi → `/dashboard` kembali ditolak setelah logout →
validasi filter produk kosong menampilkan pesan error tanpa reload
halaman.

## Catatan

- Data produk & akun admin masih in-memory (array) sesuai pilihan
  bebas di PRD (array/SQLite/PostgreSQL), data akan reset kalau server
  di-restart, tapi persisten selama server berjalan.
- Tidak ada pemanggilan API AI eksternal apa pun semua logika Tanya
  AI adalah keyword matching buatan sendiri di `routes/api.js`.
