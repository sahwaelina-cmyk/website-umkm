"use strict";

console.log("P09 JavaScript aktif");

const produkUmkm = [
  { nama: "Nasi Kotak Komplit", kategori: "Nasi Kotak", harga: 20000, stok: 12, unggulan: true },
  { nama: "Paket Prasmanan", kategori: "Prasmanan", harga: 25000, stok: 4, unggulan: false },
  { nama: "Paket Jajan Pasar", kategori: "Jajan Pasar", harga: 30000, stok: 0, unggulan: false },
  { nama: "Paket Tester", kategori: "Tester", harga: 15000, stok: 8, unggulan: true },
];

console.table(produkUmkm);

const formatRupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

console.log(formatRupiah.format(produkUmkm[0].harga));

function statusStok(stok) {
  if (stok === 0) {
    return { label: "Habis", className: "empty" };
  }

  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }

  return { label: "Tersedia", className: "" };
}

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

function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");

  if (!grid || !ringkasan) {
    return;
  }

  let jumlahTersedia = 0;
  let markup = "";

for (const produk of produkUmkm) {
    const status = statusStok(produk.stok);
    const kategori = labelKategori(produk.kategori);
    const labelAksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";
    const badgeUnggulan = produk.unggulan 
     ? '<span class="stock-badge">Produk unggulan</span>'
     : "";

    if (produk.stok > 0) {
      jumlahTersedia = jumlahTersedia + 1;
    }

    markup = markup + `
      <article class="js-product-card">
        <h3>${produk.nama}</h3>
        <p>${kategori}</p>
        <p class="price">${formatRupiah.format(produk.harga)}</p>
        <span class="stock-badge ${status.className}">${status.label}</span>
        ${badgeUnggulan}
        <p>${labelAksi}</p>
      </article>
    `;
  }

  grid.innerHTML = markup;
  ringkasan.textContent = `${jumlahTersedia} produk tersedia dari ${produkUmkm.length} data.`;
}

document.addEventListener("DOMContentLoaded", renderProduk);