# 2026-SISTEMPINJAM-FRONTEND

Antarmuka web untuk **Sistem Peminjaman Ruangan Kampus**.

## Description

Frontend React + TypeScript yang menyediakan tampilan untuk mencatat, melihat, mengelola status, dan menelusuri data peminjaman ruangan kampus.

## Features

- Daftar peminjaman dengan search, filter status, dan pagination
- Form pembuatan & pengeditan peminjaman
- Detail peminjaman + ubah status (Approve/Reject)
- Manajemen ruangan (tambah, edit, hapus)
- Validasi form sisi klien
- Koneksi ke backend via Axios

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build tool**: Vite
- **HTTP client**: Axios
- **Routing**: React Router DOM v6

## Installation

```bash
# 1. Clone repository
git clone https://github.com/Efrapaska-Panjaitan/2026-sistempinjam-frontend.git
cd 2026-sistempinjam-frontend

# 2. Install dependencies
npm install

# 3. Konfigurasi environment
cp .env.example .env
# Edit .env → pastikan VITE_API_URL mengarah ke backend

# 4. Jalankan development server
npm run dev
```

## Environment Variables

Buat file `.env` (dari `.env.example`):

```
VITE_API_URL=http://localhost:5008/api
```

## Usage

Buka browser di http://localhost:5173

Pastikan backend ASP.NET Core sudah berjalan di http://localhost:5008.

## License

MIT

