import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BookingListPage   from './pages/BookingListPage';
import BookingDetailPage from './pages/BookingDetailPage';
import BookingFormPage   from './pages/BookingFormPage';
import RoomListPage      from './pages/RoomListPage';
import RoomFormPage      from './pages/RoomFormPage';

export default function App() {
    return (
        <BrowserRouter>
            <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F9', fontFamily: 'Arial, sans-serif' }}>
                {/* Navigation bar selalu tampil di atas */}
                <Navbar />

                {/* Konten halaman */}
                <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '8px 0' }}>
                    <Routes>
                        {/* Redirect root ke /bookings */}
                        <Route path="/"           element={<Navigate to="/bookings" replace />} />

                        {/* Booking routes */}
                        <Route path="/bookings"          element={<BookingListPage />} />
                        <Route path="/bookings/new"      element={<BookingFormPage />} />
                        <Route path="/bookings/:id"      element={<BookingDetailPage />} />
                        <Route path="/bookings/:id/edit" element={<BookingFormPage />} />

                        {/* Room routes */}
                        <Route path="/rooms"          element={<RoomListPage />} />
                        <Route path="/rooms/new"      element={<RoomFormPage />} />
                        <Route path="/rooms/:id/edit" element={<RoomFormPage />} />

                        {/* 404 fallback */}
                        <Route path="*" element={
                            <div style={{ padding: '48px', textAlign: 'center' }}>
                                <h2>404 — Halaman tidak ditemukan</h2>
                                <a href="/bookings" style={{ color: '#1F4E79' }}>Kembali ke beranda</a>
                            </div>
                        } />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}
