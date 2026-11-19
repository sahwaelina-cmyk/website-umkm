const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");

const formFeedback = document.querySelector("#form-feedback");
const fields = ["nama", "email", "telepon", "paket", "pesan", "setuju"].map((id) => document.querySelector(`#${id}`));
const topikInputs = document.querySelectorAll('input[name="topik"]');
const waktuInputs = document.querySelectorAll('input[name="waktu"]');

console.log("Form:", form);
console.log("Fields:", fields);
console.log("Radio topik:", topikInputs.length, "| Radio waktu:", waktuInputs.length);

function getFieldError(field) {
  const validity = field.validity;

  if (validity.valueMissing) {
    if (field.type === "checkbox") return "Centang persetujuan terlebih dahulu.";
    return "Bagian ini wajib diisi.";
  }
  if (validity.typeMismatch) return "Format data belum sesuai.";
  if (validity.tooShort) return `Isi minimal ${field.minLength} karakter.`;
  if (validity.patternMismatch) return "Format belum sesuai contoh yang diminta.";

  return "";
}

function tampilkanError(field, pesan) {
  const error = document.querySelector(`#${field.id}-error`);
  field.setCustomValidity(pesan);
  field.setAttribute("aria-invalid", pesan ? "true" : "false");

  if (error) {
    error.textContent = pesan;
  }
}

function validasiField(field) {
  field.setCustomValidity("");
  const pesan = getFieldError(field);
  tampilkanError(field, pesan);
  return pesan === "";
}

function validasiRadio(inputs, idError, pesan) {
  const adaDipilih = Array.from(inputs).some((input) => input.checked);
  document.querySelector(`#${idError}`).textContent = adaDipilih ? "" : pesan;
  return adaDipilih;
}

fields.forEach((field) => {
  ["input", "change"].forEach((namaEvent) => {
    field.addEventListener(namaEvent, () => {
      if (field.getAttribute("aria-invalid") === "true") {
        validasiField(field);
      }
    });
  });
});

topikInputs.forEach((input) => {
  input.addEventListener("change", () => validasiRadio(topikInputs, "topik-error", "Pilih topik pertanyaan."));
});

waktuInputs.forEach((input) => {
  input.addEventListener("change", () => validasiRadio(waktuInputs, "waktu-error", "Pilih waktu untuk dihubungi."));
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    let semuaValid = true;
    fields.forEach((field) => {
        if (!validasiField(field)) semuaValid = false;
    });

    const topikValid = validasiRadio(topikInputs, "topik-error", "Pilih topik pertanyaan.");
    const waktuValid = validasiRadio(waktuInputs, "waktu-error", "Pilih waktu untuk dihubungi.");

    if (!semuaValid || !topikValid || !waktuValid || !form.checkValidity()) {
        formFeedback.textContent = "Periksa kembali bagian yang ditandai.";
        formFeedback.classList.remove("success");
        preview.textContent = "Data form akan muncul setelah tombol dikirim.";
        form.reportValidity();
        form.querySelector("input:invalid, select:invalid, textarea:invalid")?.focus();
        return;
    }

    const data = new FormData(form);
    preview.textContent = [
        `Nama: ${data.get("nama")}`,
        `Email: ${data.get("email")}`,
        `WhatsApp: ${data.get("telepon")}`,
        `Paket: ${data.get("paket")}`,
        `Topik: ${data.get("topik")}`,
        `Waktu: ${data.get("waktu")}`,
        `Pesan: ${data.get("pesan")}`,
    ].join("\n");

    formFeedback.textContent = "Form valid. Preview berhasil dibuat.";
    formFeedback.classList.add("success");
});

const STORAGE_KEY = "dapur-mak-win-preferensi-kontak";
const statusPreferensi = document.querySelector("#status-preferensi");
const tombolSimpan = document.querySelector("#simpan-preferensi");

function simpanPreferensi() {
  const data = new FormData(form);
  const channelDipilih = Array.from(document.querySelectorAll('input[name="channel"]:checked')).map((input) => input.value);

  const preferensi = {
    paket: data.get("paket"),
    topik: data.get("topik"),
    channel: channelDipilih,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferensi));
  statusPreferensi.textContent = "Preferensi disimpan.";
}

tombolSimpan.addEventListener("click", simpanPreferensi);

function muatPreferensi() {
  try {
    const tersimpan = localStorage.getItem(STORAGE_KEY);
    if (!tersimpan) return;

    const preferensi = JSON.parse(tersimpan);

    document.querySelector("#paket").value = preferensi.paket ?? "";

    const topik = document.querySelector(`input[name="topik"][value="${preferensi.topik}"]`);
    if (topik) topik.checked = true;

    (preferensi.channel ?? []).forEach((nilai) => {
      const kotak = document.querySelector(`input[name="channel"][value="${nilai}"]`);
      if (kotak) kotak.checked = true;
    });

    statusPreferensi.textContent = "Preferensi dimuat dari penyimpanan lokal.";
  } catch (error) {
    console.warn("Preferensi tidak valid.", error);
    localStorage.removeItem(STORAGE_KEY);
  }
}

muatPreferensi();

const tombolHapus = document.querySelector("#hapus-preferensi");

function hapusPreferensi() {
  localStorage.removeItem(STORAGE_KEY);

  document.querySelector("#paket").value = "";
  topikInputs.forEach((input) => {
    input.checked = false;
  });
  document.querySelectorAll('input[name="channel"]').forEach((kotak) => {
    kotak.checked = false;
  });

  statusPreferensi.textContent = "Preferensi dihapus.";
}

tombolHapus.addEventListener("click", hapusPreferensi);