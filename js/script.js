const promoButton = document.querySelector("#promoButton");

promoButton.addEventListener("click", () => {
    promoButton.textContent = "Promo: Gratis 1 kotak untuk pemesanan 20 kotak!";
    console.log("Promo Dapur Mak Win berhasil ditampilkan.");
});