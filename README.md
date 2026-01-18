# LearnCheck Frontend

LearnCheck adalah aplikasi pembelajaran interaktif berbasis web yang membantu pengguna mempelajari materi, mengerjakan kuis, dan memantau progres belajar. Proyek ini dikembangkan menggunakan React, Vite, dan Tailwind CSS untuk memberikan pengalaman belajar yang modern, responsif, dan mudah digunakan.

## 📝 Deskripsi Singkat Proyek
LearnCheck merupakan platform edukasi berbasis web yang menyediakan materi pembelajaran terstruktur, kuis interaktif, serta fitur pemantauan progres belajar untuk pengguna.

## ⚙️ Petunjuk Setup Environment
1. **Clone repository:**
    ```bash
    git clone https://github.com/learncheck/frontend-learncheck-final.git
    cd frontend-learncheck-final
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Jalankan aplikasi:**
    ```bash
    npm run dev
    ```
4. **Akses di browser:**
    Buka [http://localhost:5173](http://localhost:5173) untuk melihat aplikasi.

## 🤖 Tautan Model ML (Jika Ada)
Saat ini, aplikasi LearnCheck **tidak menggunakan model Machine Learning**. Jika di masa mendatang terdapat integrasi model ML, tautan unduh dan instruksi pemuatan akan ditambahkan di sini.

## 🚀 Cara Menjalankan Aplikasi
- Pastikan Node.js dan npm sudah terpasang di komputer Anda.
- Ikuti langkah pada bagian **Petunjuk Setup Environment** di atas.
- Setelah menjalankan `npm run dev`, akses aplikasi melalui browser di [http://localhost:5173](http://localhost:5173).

## ✨ Fitur Utama
- **Autentikasi pengguna:** Login & Register dengan validasi.
- **Daftar modul & submodul:** Navigasi materi terstruktur.
- **Materi interaktif:** Konten belajar dengan gambar, animasi, dan video.
- **Kuis per submodul & kuis akhir:** Soal pilihan ganda, skor otomatis.
- **Review hasil kuis & feedback:** Lihat jawaban benar/salah dan penjelasan.
- **Dashboard progres belajar:** Pantau perkembangan dan statistik belajar.
- **Tema gelap/terang:** Pilihan mode tampilan sesuai preferensi pengguna.

## 🛠️ Pengembangan
- Edit atau tambahkan komponen di `src/components/` untuk UI baru.
- Tambah halaman baru di `src/pages/` sesuai kebutuhan fitur.
- Ubah atau tambahkan data mock di `src/constants/` untuk pengujian.
- Konfigurasi atau integrasi API di `src/services/`.

## 📁 Struktur Folder

frontend-learncheck-final/
├── public/                # File statis & aset (ikon, favicon, dsb)
├── src/
│   ├── assets/            # Gambar, animasi, video
│   ├── components/        # Komponen UI reusable (Navbar, Button, Card, dsb)
│   ├── constants/         # Konstanta, data mock, konfigurasi
│   ├── context/           # Context API (auth, theme, dsb)
│   ├── hooks/             # Custom hooks (useAuth, useTheme, dsb)
│   ├── pages/             # Halaman utama (Home, Login, Dashboard, dsb)
│   ├── services/          # API service (fetch data, auth, dsb)
│   ├── types/             # Tipe data TypeScript
│   └── utils/             # Utility functions (helper, formatter, dsb)
├── index.html
├── package.json
├── vite.config.js
└── README.md

## 📄 Contoh Penggunaan
- **Login/register:** Buat akun atau masuk untuk mulai belajar.
- **Pilih submodul:** Telusuri daftar materi, baca penjelasan, dan pelajari konten interaktif.
- **Kerjakan kuis:** Jawab soal, dapatkan skor, dan review hasil.
- **Pantau progres:** Lihat statistik belajar dan progres di dashboard.

## 🙌 Kontribusi
Pull request & issue sangat terbuka untuk pengembangan lebih lanjut! Silakan fork repo, buat branch baru, dan ajukan perubahan.

© 2025 LearnCheck Team

