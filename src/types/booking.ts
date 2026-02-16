// ── Types untuk Booking ─

export type BookingStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Booking {
    id: number;
    borrowerName: string;
    purposeOfUse: string;
    startTime: string;    // ISO 8601 string dari API
    endTime: string;
    status: BookingStatus;
    notes?: string;
    roomId: number;
    roomName: string;
    roomCode: string;
    building: string;
    createdAt: string;
    updatedAt: string;
}

// Data yang dikirim saat POST /api/bookings
export interface BookingCreatePayload {
    borrowerName: string;
    purposeOfUse: string;
    startTime: string;
    endTime: string;
    notes?: string;
    roomId: number;
}

// Data yang dikirim saat PUT /api/bookings/{id}
export interface BookingUpdatePayload {
    borrowerName: string;
    purposeOfUse: string;
    startTime: string;
    endTime: string;
    notes?: string;
    roomId: number;
}

// Response dari GET /api/bookings (dengan pagination)
export interface BookingListResponse {
    data: Booking[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ── Types untuk Room ───────────────────────────────────────────────────────

export interface Room {
    id: number;
    name: string;
    roomCode: string;
    capacity: number;
    building: string;
    floor?: string;
    isActive: boolean;
    createdAt: string;
}

export interface RoomCreatePayload {
    name: string;
    roomCode: string;
    capacity: number;
    building: string;
    floor?: string;
}

export interface RoomUpdatePayload extends RoomCreatePayload {
    isActive: boolean;
}

// ── Query params untuk daftar booking ─────────────────────────────────────

export interface BookingQueryParams {
    search?: string;
    status?: BookingStatus | '';
    page?: number;
    pageSize?: number;
}
