<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/0958d058-9193-462e-8732-375266f43429

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Firebase Realtime Database

Data operasional (menu, order, stok FIFO, laporan, PIN/settings, chat tim) bisa disinkron realtime antar perangkat.

- Isi `VITE_FIREBASE_*` di `.env.local`, **atau** klik indikator Cloud di header aplikasi lalu tempel `firebaseConfig` dari Firebase Console.
- Struktur data: `servers/78/master_menu`, `orders`, `stok_fifo`, `laporan`, `settings/pins`, `settings/stok_mode`, `chat`.
- Tanpa konfigurasi Firebase, aplikasi otomatis berjalan mode lokal (localStorage) seperti sebelumnya.
- Realtime Database Rules harus mengizinkan read/write (atau aktifkan Anonymous Auth + rules berbasis auth).

## Customer QR Ordering (modul baru)

Customer memesan sendiri dari HP dengan scan QR di meja — tanpa install dan tanpa login.

- **QR per meja**: buka tab **Meja & QR** (role Owner). Setiap meja punya token acak 24 karakter. Bisa disalin, dicetak semua sekaligus, atau dirotasi.
- **URL customer**: `/order/t/<token>` (halaman menu mobile-first: kategori, pencarian, detail item, catatan, keranjang, status pesanan realtime, panggil pelayan, tagihan).
- **Mode persetujuan** (`servers/78/v2/settings/customer.orderApprovalMode`):
  - `auto_approve` — pesanan langsung masuk antrean dapur & stok dipotong saat dikirim.
  - `staff_approval` — pesanan masuk tab **Customer → Persetujuan**; stok baru dipotong setelah kasir menyetujui. Penolakan ditandai `ditolak`.
- **Pembayaran**:
  - `selfPaymentEnabled: true` — customer bisa kirim klaim QRIS/Transfer; kasir memverifikasi di tab **Customer → Pembayaran**.
  - `false` — customer hanya bisa "Minta tagihan" (panggilan pelayan).
- **Panggil pelayan**: tombol di halaman Pesanan/Tagihan; muncul realtime di tab **Customer → Panggilan** dan bisa ditandai selesai.
- **Sesi meja**: dibuat otomatis saat QR pertama dipindai, ditutup oleh staf (verifikasi pembayaran atau "Lunasi & tutup"). Setelah ditutup, halaman customer menampilkan status sesi berakhir.
- Semua data modul ini ada di `servers/78/v2/`: `tables`, `sessions`, `orders` (dengan `source: customer_web`, `sessionId`, `tableId`), `waiter_calls`, `payment_claims`, `settings/customer`.

Catatan keamanan: karena stack ini memakai Firebase RTDB dengan rules terbuka (tanpa auth server), validasi harga/stok dilakukan di client terhadap data terbaru — cukup untuk operasional internal, tapi bukan pengganti `verifyCustomerSession` + rate limiting di PRD (yang mengasumsikan Express + PostgreSQL).
