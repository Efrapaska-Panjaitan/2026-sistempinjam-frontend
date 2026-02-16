import api from './api';
import type { Room, RoomCreatePayload, RoomUpdatePayload } from '../types/booking';

const roomService = {
    // GET /api/rooms
    getAll: async (search?: string): Promise<Room[]> => {
        const response = await api.get<Room[]>('/rooms', {
            params: search ? { search } : undefined,
        });
        return response.data;
    },

    // GET /api/rooms/{id}
    getById: async (id: number): Promise<Room> => {
        const response = await api.get<Room>(`/rooms/${id}`);
        return response.data;
    },

    // POST /api/rooms
    create: async (payload: RoomCreatePayload): Promise<{ id: number; message: string }> => {
        const response = await api.post('/rooms', payload);
        return response.data;
    },

    // PUT /api/rooms/{id}
    update: async (id: number, payload: RoomUpdatePayload): Promise<void> => {
        await api.put(`/rooms/${id}`, payload);
    },

    // DELETE /api/rooms/{id}
    delete: async (id: number): Promise<void> => {
        await api.delete(`/rooms/${id}`);
    },
};

export default roomService;
