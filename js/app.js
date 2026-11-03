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

function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");
  const unggulan = document.querySelector("#produk-unggulan");
  
  if (!grid || !ringkasan || !unggulan) {
    console.warn("Target render produk belum lengkap.");
    return;
  }
  
  //array methods: filter, find, dan map
  const produkTersedia = produkUmkm.filter((produk) => produk.stok > 0);
  const produkUnggulan = produkUmkm.find((produk) => produk.unggulan === true);
  const markupProduk = produkTersedia.map(buatKartuProduk).join("");
  
  //forEach dipakai untuk debugging, bukan membuat HTML baru
  produkUmkm.forEach((produk) => {
    console.log("Debug produk:", produk.nama, "stok:", produk.stok);
  });
  
  grid.innerHTML = markupProduk;
  ringkasan.textContent = `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data.`;
  unggulan.textContent = produkUnggulan 
    ? `Produk unggulan: ${produkUnggulan.nama}` 
    : "Belum ada produk unggulan.";
}

document.addEventListener("DOMContentLoaded", renderProduk);