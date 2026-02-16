import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import RoomListPage from './pages/RoomListPage';
import RoomFormPage from './pages/RoomFormPage';

export default function App() {
    return (
        <BrowserRouter>
            <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F9', fontFamily: 'Arial, sans-serif' }}>
                <Navbar />
                <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '8px 0' }}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/rooms" replace />} />
                        <Route path="/rooms" element={<RoomListPage />} />
                        <Route path="/rooms/new" element={<RoomFormPage />} />
                        <Route path="/rooms/:id/edit" element={<RoomFormPage />} />
                        <Route path="*" element={<div style={{ padding: '48px', textAlign: 'center' }}><h2>404 — Halaman tidak ditemukan</h2></div>} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}