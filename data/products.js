// Data produk dummy (Sprint 1) - nanti di Sprint 2 bisa dipindah ke SQLite/PostgreSQL
const products = [
  {
    id: 1,
    name: "Beras Pandan Wangi 5kg",
    category: "sembako",
    price: 65000,
    stock: 20,
    description: "Beras pulen kualitas premium, cocok untuk kebutuhan sehari-hari keluarga.",
  },
  {
    id: 2,
    name: "Minyak Goreng 2L",
    category: "sembako",
    price: 34000,
    stock: 15,
    description: "Minyak goreng kemasan jerigen 2 liter, jernih dan tidak mudah tengik.",
  },
  {
    id: 3,
    name: "Gula Pasir 1kg",
    category: "sembako",
    price: 16000,
    stock: 30,
    description: "Gula pasir putih bersih, cocok untuk minuman dan masakan sehari-hari.",
  },
  {
    id: 4,
    name: "Telur Ayam 1kg",
    category: "sembako",
    price: 29000,
    stock: 25,
    description: "Telur ayam negeri segar, dipilih langsung dari peternak lokal.",
  },
  {
    id: 5,
    name: "Sabun Cuci Piring 800ml",
    category: "rumah-tangga",
    price: 15500,
    stock: 18,
    description: "Sabun cuci piring wangi jeruk nipis, ampuh mengangkat lemak membandel.",
  },
  {
    id: 6,
    name: "Tisu Gulung 4 Roll",
    category: "rumah-tangga",
    price: 18000,
    stock: 10,
    description: "Tisu toilet lembut isi 4 roll, hemat untuk kebutuhan rumah tangga.",
  },
];

module.exports = products;