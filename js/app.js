"use strict";

console.log("P09 JavaScript aktif");

const produkUmkm = [
  { nama: "Nasi Kotak Komplit", kategori: "Nasi Kotak", harga: 20000, stok: 12, unggulan: true },
  { nama: "Paket Prasmanan", kategori: "Prasmanan", harga: 25000, stok: 4, unggulan: false },
  { nama: "Paket Jajan Pasar", kategori: "Jajan Pasar", harga: 30000, stok: 0, unggulan: false },
  { nama: "Paket Tester", kategori: "Tester", harga: 15000, stok: 8, unggulan: true },
];

console.table(produkUmkm);

//function pengubah angka menjadi teks rupiah
function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

console.log(formatRupiah(produkUmkm[0].harga));

function statusStok(stok) {
  if (stok <= 0) {
    return { label: "Habis", className: "empty" };
  }

  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }

  return { label: "Tersedia", className: "" };
}

//tes tiga kemungkinan status stok
console.log(statusStok(0));
console.log(statusStok(3));
console.log(statusStok(12));

function labelKategori(kategori) {
  switch (kategori) {
    case "Nasi Kotak":
      return "Menu harian praktis";
    case "Prasmanan":
      return "Untuk acara besar";
    case "Jajan Pasar":
      return "Suguhan tradisional";
    case "Tester":
      return "Coba dulu, hemat";
    default:
      return "Produk UMKM";
  }
}

//function pembuat kartu: input satu object produk, output teks HTML
function buatKartuProduk(produk) {
  const status = statusStok(produk.stok);
  const kategori = labelKategori(produk.kategori);
  const labelAksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";
  const badgeUnggulan = produk.unggulan
    ? '<span class="stock-badge">Produk unggulan</span>'
    : "";

  return `
    <article class="js-product-card">
      <h3>${produk.nama}</h3>
      <p>${kategori}</p>
      <p class="price">${formatRupiah(produk.harga)}</p>
      <span class="stock-badge ${status.className}">${status.label}</span>
      ${badgeUnggulan}
      <p>${labelAksi}</p>
    </article>
  `;
}

//tes sementara: lihat hasil HTML satu produk
console.log(buatKartuProduk(produkUmkm[0]));

const produkGrid = document.querySelector("#produk-dinamis");
const produkStatus = document.querySelector("#produk-ringkasan");
const tombolFilter = document.querySelectorAll("[data-filter]");

console.log("Target grid:", produkGrid);
console.log("Target status:", produkStatus);
console.log("Jumlah tombol filter:", tombolFilter.length);

function buatElemenProduk(produk) {
  const card = document.createElement("article");
  card.classList.add("js-product-card");

  const title = document.createElement("h3");
  title.textContent = produk.nama;

  const category = document.createElement("p");
  category.textContent = labelKategori(produk.kategori);

  const price = document.createElement("p");
  price.classList.add("price");
  price.textContent = formatRupiah(produk.harga);

  const stock = document.createElement("span");
  const status = statusStok(produk.stok);
  stock.classList.add("stock-badge");
  if (status.className) {
    stock.classList.add(status.className);
  }
  stock.textContent = status.label;

  const aksi = document.createElement("p");
  aksi.textContent = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";

  card.append(title, category, price, stock);

  if (produk.unggulan) {
    const badgeUnggulan = document.createElement("span");
    badgeUnggulan.classList.add("stock-badge");
    badgeUnggulan.textContent = "Produk unggulan";
    card.append(badgeUnggulan);
  }
  
  card.append(aksi);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Sembunyikan";
  removeButton.classList.add("ghost-button");

  removeButton.addEventListener("click", () => {
    card.remove();
    produkStatus.textContent = "Satu kartu disembunyikan dari tampilan sementara.";
  });

  card.append(removeButton);
  return card;
}

console.log("Tes elemen:", buatElemenProduk(produkUmkm[0]));

function buatEmptyState(kategori) {
  const empty = document.createElement("p");
  empty.classList.add("empty-state");
  empty.textContent = `Belum ada produk pada kategori ${kategori}.`;
  return empty;
}

function renderProduk(kategoriAktif = "Semua") {
  const unggulan = document.querySelector("#produk-unggulan");
  
  if (!produkGrid || !produkStatus || !unggulan) {
    console.warn("Target render produk belum lengkap.");
    return;
  }
  
  console.log("Render dipanggil, semua target ditemukan.");
  
  const produkUnggulan = produkUmkm.find((produk) => produk.unggulan === true);

  unggulan.textContent = produkUnggulan 
    ? `Produk unggulan: ${produkUnggulan.nama}` 
    : "Belum ada produk unggulan.";

  const produkTampil = kategoriAktif === "Semua"
    ? produkUmkm
    : produkUmkm.filter((produk) => produk.kategori === kategoriAktif);

  produkGrid.replaceChildren();

  if (produkTampil.length === 0) {
    produkGrid.append(buatEmptyState(kategoriAktif));
    produkStatus.textContent = "0 produk ditemukan.";
    return;
  }

  produkTampil.forEach((produk) => {
    produkGrid.append(buatElemenProduk(produk));
  });

  produkStatus.textContent = `${produkTampil.length} produk ditampilkan.`;
}

tombolFilter.forEach((tombol) => {
tombol.addEventListener("click", (event) => {
  
  const tombolAktif = event.currentTarget;
  const kategori = tombolAktif.dataset.filter;
  
  console.log("Filter diklik:", kategori);
  
  tombolFilter.forEach((item) => item.classList.remove("is-active"));
  tombolAktif.classList.add("is-active");
  
  renderProduk(kategori);
});
});

document.addEventListener("DOMContentLoaded", () => {
  renderProduk();
});