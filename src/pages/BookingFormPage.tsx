import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import bookingService from '../services/bookingService';
import roomService from '../services/roomService';
import type { Room, BookingCreatePayload } from '../types/booking';

// Konversi datetime-local string <-> ISO string
function toLocalInput(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toIso(local: string): string {
    if (!local) return '';
    return new Date(local).toISOString();
}

interface FormValues {
    borrowerName: string;
    purposeOfUse: string;
    startTime: string;
    endTime: string;
    notes: string;
    roomId: string;
}

const emptyForm: FormValues = {
    borrowerName: '',
    purposeOfUse: '',
    startTime: '',
    endTime: '',
    notes: '',
    roomId: '',
};

export default function BookingFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm]         = useState<FormValues>(emptyForm);
    const [rooms, setRooms]       = useState<Room[]>([]);
    const [errors, setErrors]     = useState<Partial<FormValues>>({});
    const [loading, setLoading]   = useState(false);
    const [initLoading, setInitLoading] = useState(isEdit);
    const [apiError, setApiError] = useState('');

    // Load rooms untuk dropdown
    useEffect(() => {
        roomService.getAll().then(setRooms).catch(() => {});
    }, []);

    // Jika edit: load data booking yang ada
    useEffect(() => {
        if (!isEdit || !id) return;
        (async () => {
            try {
                const data = await bookingService.getById(Number(id));
                setForm({
                    borrowerName: data.borrowerName,
                    purposeOfUse: data.purposeOfUse,
                    startTime:    toLocalInput(data.startTime),
                    endTime:      toLocalInput(data.endTime),
                    notes:        data.notes ?? '',
                    roomId:       String(data.roomId),
                });
            } catch (err) {
                setApiError(err instanceof Error ? err.message : 'Gagal memuat data.');
            } finally {
                setInitLoading(false);
            }
        })();
    }, [id, isEdit]);

    // Update satu field form
    const handleChange = (field: keyof FormValues, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    // Validasi sisi klien
    const validate = (): boolean => {
        const e: Partial<FormValues> = {};
        if (!form.borrowerName.trim()) e.borrowerName = 'Nama peminjam wajib diisi.';
        if (!form.purposeOfUse.trim()) e.purposeOfUse = 'Keperluan wajib diisi.';
        if (!form.startTime) e.startTime = 'Waktu mulai wajib diisi.';
        if (!form.endTime)   e.endTime   = 'Waktu selesai wajib diisi.';
        if (form.startTime && form.endTime && form.endTime <= form.startTime)
            e.endTime = 'Waktu selesai harus setelah waktu mulai.';
        if (!form.roomId)    e.roomId    = 'Pilih ruangan.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setApiError('');

        const payload: BookingCreatePayload = {
            borrowerName: form.borrowerName.trim(),
            purposeOfUse: form.purposeOfUse.trim(),
            startTime:    toIso(form.startTime),
            endTime:      toIso(form.endTime),
            notes:        form.notes.trim() || undefined,
            roomId:       Number(form.roomId),
        };

        try {
            if (isEdit && id) {
                await bookingService.update(Number(id), payload);
                navigate(`/bookings/${id}`);
            } else {
                const res = await bookingService.create(payload);
                navigate(`/bookings/${res.id}`);
            }
        } catch (err) {
            setApiError(err instanceof Error ? err.message : 'Gagal menyimpan data.');
        } finally {
            setLoading(false);
        }
    };

    if (initLoading) return <div style={{ padding: '32px' }}>Memuat data...</div>;

    return (
        <div style={{ padding: '24px', maxWidth: '560px' }}>
            {/* Back */}
            <Link to="/bookings" style={{ color: '#1F4E79', textDecoration: 'none', fontSize: '14px' }}>
                ← Kembali ke Daftar
            </Link>

            <h1 style={{ fontSize: '22px', margin: '16px 0 24px' }}>
                {isEdit ? 'Edit Peminjaman' : 'Buat Peminjaman Baru'}
            </h1>

            {apiError && <div style={alertStyle}>{apiError}</div>}

            <form onSubmit={handleSubmit} noValidate>

                {/* Nama Peminjam */}
                <Field label="Nama Peminjam" error={errors.borrowerName}>
                    <input
                        type="text"
                        value={form.borrowerName}
                        onChange={(e) => handleChange('borrowerName', e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        style={inputStyle(!!errors.borrowerName)}
                        maxLength={100}
                    />
                </Field>

                {/* Keperluan */}
                <Field label="Keperluan / Tujuan" error={errors.purposeOfUse}>
                    <input
                        type="text"
                        value={form.purposeOfUse}
                        onChange={(e) => handleChange('purposeOfUse', e.target.value)}
                        placeholder="Contoh: Rapat tim, Seminar, Praktikum"
                        style={inputStyle(!!errors.purposeOfUse)}
                        maxLength={255}
                    />
                </Field>

                {/* Ruangan */}
                <Field label="Pilih Ruangan" error={errors.roomId}>
                    <select
                        value={form.roomId}
                        onChange={(e) => handleChange('roomId', e.target.value)}
                        style={inputStyle(!!errors.roomId)}
                    >
                        <option value="">-- Pilih Ruangan --</option>
                        {rooms.filter(r => r.isActive).map((r) => (
                            <option key={r.id} value={r.id}>
                                [{r.roomCode}] {r.name} — {r.building} (Kapasitas: {r.capacity})
                            </option>
                        ))}
                    </select>
                </Field>

                {/* Waktu Mulai */}
                <Field label="Waktu Mulai" error={errors.startTime}>
                    <input
                        type="datetime-local"
                        value={form.startTime}
                        onChange={(e) => handleChange('startTime', e.target.value)}
                        style={inputStyle(!!errors.startTime)}
                    />
                </Field>

                {/* Waktu Selesai */}
                <Field label="Waktu Selesai" error={errors.endTime}>
                    <input
                        type="datetime-local"
                        value={form.endTime}
                        onChange={(e) => handleChange('endTime', e.target.value)}
                        style={inputStyle(!!errors.endTime)}
                    />
                </Field>

                {/* Catatan (opsional) */}
                <Field label="Catatan (opsional)">
          <textarea
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Catatan tambahan..."
              rows={3}
              style={{ ...inputStyle(false), resize: 'vertical' }}
              maxLength={500}
          />
                </Field>

                {/* Submit */}
                <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: loading ? '#AAA' : '#1F4E79',
                            color: '#fff',
                            padding: '9px 24px',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '15px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Peminjaman'}
                    </button>
                    <Link
                        to="/bookings"
                        style={{
                            padding: '9px 20px',
                            borderRadius: '4px',
                            backgroundColor: '#6C757D',
                            color: '#fff',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '15px',
                        }}
                    >
                        Batal
                    </Link>
                </div>

            </form>
        </div>
    );
}

// ── Helpers ───────────────────────────────────────────────────────────────

function Field({ label, error, children }: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
                {label}
            </label>
            {children}
            {error && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#DC3545' }}>{error}</p>}
        </div>
    );
}

function inputStyle(hasError: boolean): React.CSSProperties {
    return {
        width: '100%',
        padding: '8px 12px',
        border: `1px solid ${hasError ? '#DC3545' : '#CCC'}`,
        borderRadius: '4px',
        fontSize: '14px',
        boxSizing: 'border-box',
        outline: 'none',
    };
}

const alertStyle: React.CSSProperties = {
    backgroundColor: '#F8D7DA',
    color: '#721C24',
    padding: '10px 14px',
    borderRadius: '4px',
    marginBottom: '16px',
    border: '1px solid #F5C6CB',
    fontSize: '14px',
};
