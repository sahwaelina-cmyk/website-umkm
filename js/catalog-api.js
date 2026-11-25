const DATA_URL = "data/products.json";

const catalogStatus = document.querySelector("#catalog-status");
const produkGrid = document.querySelector("#produk-dinamis");
const produkRingkasan = document.querySelector("#produk-ringkasan");
const produkUnggulan = document.querySelector("#produk-unggulan");
const tombolFilter = document.querySelectorAll("[data-filter]");

let products = [];
let activeCategory = "Semua";

// Mengatur pesan status di halaman
function setStatus(state, message) {
  catalogStatus.className = "catalog-status";
  if (state) {
    catalogStatus.classList.add(state);
  }
  catalogStatus.textContent = message;
}

// Mengubah angka menjadi format Rupiah
function formatRupiah(angka) {
  return "Rp" + angka.toLocaleString("id-ID");
}

// Membuat satu kartu produk
function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const nama = document.createElement("h3");
  nama.textContent = product.nama;

  const kategori = document.createElement("p");
  kategori.textContent = product.kategori;

  const deskripsi = document.createElement("p");
  deskripsi.textContent = product.deskripsi;

  const harga = document.createElement("p");
  harga.className = "price";
  harga.textContent = formatRupiah(product.harga);

  const stok = document.createElement("p");
  stok.className = "product-stock";
  if (product.stok === 0) {
    stok.textContent = "Stok habis";
    stok.classList.add("habis");
  } else {
    stok.textContent = "Stok: " + product.stok;
  }

  card.append(nama, kategori, deskripsi, harga, stok);
  return card;
}

// Membuat pesan kalau produk kosong
function createEmptyState() {
  const pesan = document.createElement("p");
  pesan.className = "empty-state";
  pesan.textContent = "Belum ada produk pada kategori ini.";
  return pesan;
}

// Menampilkan daftar produk ke halaman
function renderProducts(items) {
  produkGrid.replaceChildren();

  if (items.length === 0) {
    produkGrid.append(createEmptyState());
    produkRingkasan.textContent = "0 produk ditemukan.";
    setStatus("empty", "Request berhasil, tetapi tidak ada produk untuk ditampilkan.");
    return;
  }

  items.forEach((product) => {
    produkGrid.append(createProductCard(product));
  });

  produkRingkasan.textContent = items.length + " produk ditampilkan.";
  setStatus("success", items.length + " produk berhasil dimuat.");
}

// Menampilkan nama produk unggulan
function renderFeatured() {
  const unggulan = products.filter((product) => product.unggulan);

  if (unggulan.length === 0) {
    produkUnggulan.textContent = "Belum ada produk unggulan.";
    return;
  }

  const daftarNama = unggulan.map((product) => product.nama);
  produkUnggulan.textContent = "Produk unggulan: " + daftarNama.join(", ");
}

// Mengambil data produk dari file JSON
async function loadProducts() {
  try {
    setStatus("loading", "Memuat data produk...");

    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error("HTTP status " + response.status);
    }

    products = await response.json();

    renderFeatured();
    renderProducts(products);
  } catch (error) {
    produkGrid.replaceChildren();
    produkRingkasan.textContent = "Produk tidak dapat ditampilkan.";
    setStatus("error", "Gagal memuat produk: " + error.message);
  }
}

// Menyaring produk berdasarkan kategori
function applyFilter(category) {
  activeCategory = category;

  let filtered;
  if (category === "Semua") {
    filtered = products;
  } else {
    filtered = products.filter((product) => product.kategori === category);
  }

  renderProducts(filtered);
}

// Memasang klik pada tombol filter
tombolFilter.forEach((button) => {
  button.addEventListener("click", (event) => {
    tombolFilter.forEach((item) => item.classList.remove("is-active"));
    event.currentTarget.classList.add("is-active");
    applyFilter(event.currentTarget.dataset.filter);
  });
});
loadProducts();