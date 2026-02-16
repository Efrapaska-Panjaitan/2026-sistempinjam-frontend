import axios from 'axios';

// Base URL diambil dari environment variable Vite
// Saat development: baca dari .env → VITE_API_URL=http://localhost:5008/api
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5008/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: tangkap error global dari API
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Jika server mengirim pesan error terstruktur, tampilkan itu
        const message =
            error.response?.data?.message ||
            error.response?.data?.title ||
            error.message ||
            'Terjadi kesalahan. Silakan coba lagi.';
        return Promise.reject(new Error(message));
    }
);

export default api;
