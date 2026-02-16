import api from './api';
import type {
    Booking,
    BookingCreatePayload,
    BookingUpdatePayload,
    BookingListResponse,
    BookingQueryParams,
    BookingStatus,
} from '../types/booking';

const bookingService = {
    // GET /api/bookings?search=...&status=...&page=...&pageSize=...
    getAll: async (params?: BookingQueryParams): Promise<BookingListResponse> => {
        const response = await api.get<BookingListResponse>('/bookings', { params });
        return response.data;
    },

    // GET /api/bookings/{id}
    getById: async (id: number): Promise<Booking> => {
        const response = await api.get<Booking>(`/bookings/${id}`);
        return response.data;
    },

    // POST /api/bookings
    create: async (payload: BookingCreatePayload): Promise<{ id: number; message: string }> => {
        const response = await api.post('/bookings', payload);
        return response.data;
    },

    // PUT /api/bookings/{id}
    update: async (id: number, payload: BookingUpdatePayload): Promise<void> => {
        await api.put(`/bookings/${id}`, payload);
    },

    // PATCH /api/bookings/{id}/status
    updateStatus: async (id: number, status: BookingStatus): Promise<void> => {
        await api.patch(`/bookings/${id}/status`, { status });
    },

    // DELETE /api/bookings/{id}
    delete: async (id: number): Promise<void> => {
        await api.delete(`/bookings/${id}`);
    },
};

export default bookingService;
