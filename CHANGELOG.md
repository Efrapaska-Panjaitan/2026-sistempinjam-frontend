# Changelog

## [1.0.0] - 2026-02-17

### Added
- Inisialisasi proyek React 18 + TypeScript dengan Vite
- Konfigurasi Axios dengan base URL dari environment variable
- TypeScript interfaces: `Booking`, `Room`, dan semua payload/response types
- `bookingService`: getAll, getById, create, update, updateStatus, delete
- `roomService`: getAll, getById, create, update, delete
- **BookingListPage**: tabel daftar peminjaman + search + filter status + pagination
- **BookingDetailPage**: detail peminjaman + tombol ubah status (Approve/Reject/Pending)
- **BookingFormPage**: form create dan edit peminjaman dengan validasi
- **RoomListPage**: tabel daftar ruangan dengan aksi edit dan hapus
- **RoomFormPage**: form create dan edit ruangan dengan validasi
- **Navbar**: navigasi antar halaman
- **StatusBadge**: komponen badge warna per status
- React Router DOM v6 dengan routing lengkap
- Validasi form sisi klien (field required, format datetime, konflik waktu)
- `.gitignore` untuk React/Node
- `.env.example` sebagai template konfigurasi
