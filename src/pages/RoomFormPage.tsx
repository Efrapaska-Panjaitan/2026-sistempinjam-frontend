import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import roomService from '../services/roomService';

interface FormValues {
    name: string;
    roomCode: string;
    capacity: string;
    building: string;
    floor: string;
    isActive: boolean;
}

const emptyForm: FormValues = {
    name: '', roomCode: '', capacity: '', building: '', floor: '', isActive: true,
};

export default function RoomFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm]           = useState<FormValues>(emptyForm);
    const [errors, setErrors]       = useState<Partial<Record<keyof FormValues, string>>>({});
    const [loading, setLoading]     = useState(false);
    const [initLoading, setInitLoading] = useState(isEdit);
    const [apiError, setApiError]   = useState('');

    // Load data ruangan jika edit mode
    useEffect(() => {
        if (!isEdit || !id) return;
        roomService.getById(Number(id))
            .then((data) => {
                setForm({
                    name:     data.name,
                    roomCode: data.roomCode,
                    capacity: String(data.capacity),
                    building: data.building,
                    floor:    data.floor ?? '',
                    isActive: data.isActive,
                });
            })
            .catch((err) => setApiError(err.message))
            .finally(() => setInitLoading(false));
    }, [id, isEdit]);

    const handleChange = (field: keyof FormValues, value: string | boolean) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const validate = (): boolean => {
        const e: Partial<Record<keyof FormValues, string>> = {};
        if (!form.name.trim())     e.name     = 'Nama ruangan wajib diisi.';
        if (!form.roomCode.trim()) e.roomCode = 'Kode ruangan wajib diisi.';
        if (!form.building.trim()) e.building = 'Gedung wajib diisi.';
        const cap = Number(form.capacity);
        if (!form.capacity || isNaN(cap) || cap < 1 || cap > 1000)
            e.capacity = 'Kapasitas harus antara 1 dan 1000.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setApiError('');

        const payload = {
            name:     form.name.trim(),
            roomCode: form.roomCode.trim().toUpperCase(),
            capacity: Number(form.capacity),
            building: form.building.trim(),
            floor:    form.floor.trim() || undefined,
            isActive: form.isActive,
        };

        try {
            if (isEdit && id) {
                await roomService.update(Number(id), payload);
            } else {
                await roomService.create(payload);
            }
            navigate('/rooms');
        } catch (err) {
            setApiError(err instanceof Error ? err.message : 'Gagal menyimpan.');
        } finally {
            setLoading(false);
        }
    };

    if (initLoading) return <div style={{ padding: '32px' }}>Memuat data...</div>;

    return (
        <div style={{ padding: '24px', maxWidth: '480px' }}>
            <Link to="/rooms" style={{ color: '#1F4E79', textDecoration: 'none', fontSize: '14px' }}>
                ← Kembali ke Daftar Ruangan
            </Link>

            <h1 style={{ fontSize: '22px', margin: '16px 0 24px' }}>
                {isEdit ? 'Edit Ruangan' : 'Tambah Ruangan Baru'}
            </h1>

            {apiError && (
                <div style={{ backgroundColor: '#F8D7DA', color: '#721C24', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', border: '1px solid #F5C6CB', fontSize: '14px' }}>
                    {apiError}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

                <Field label="Nama Ruangan" error={errors.name}>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Contoh: Ruang Rapat A"
                        style={inp(!!errors.name)}
                        maxLength={100}
                    />
                </Field>

                <Field label="Kode Ruangan" error={errors.roomCode}>
                    <input
                        type="text"
                        value={form.roomCode}
                        onChange={(e) => handleChange('roomCode', e.target.value)}
                        placeholder="Contoh: RR-A, LAB-1"
                        style={inp(!!errors.roomCode)}
                        maxLength={20}
                    />
                </Field>

                <Field label="Kapasitas (orang)" error={errors.capacity}>
                    <input
                        type="number"
                        value={form.capacity}
                        onChange={(e) => handleChange('capacity', e.target.value)}
                        min={1}
                        max={1000}
                        style={inp(!!errors.capacity)}
                    />
                </Field>

                <Field label="Nama Gedung" error={errors.building}>
                    <input
                        type="text"
                        value={form.building}
                        onChange={(e) => handleChange('building', e.target.value)}
                        placeholder="Contoh: Gedung A"
                        style={inp(!!errors.building)}
                        maxLength={100}
                    />
                </Field>

                <Field label="Lantai (opsional)">
                    <input
                        type="text"
                        value={form.floor}
                        onChange={(e) => handleChange('floor', e.target.value)}
                        placeholder="Contoh: 1, 2, 3"
                        style={inp(false)}
                        maxLength={20}
                    />
                </Field>

                {isEdit && (
                    <Field label="Status Ruangan">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                            <input
                                type="checkbox"
                                checked={form.isActive}
                                onChange={(e) => handleChange('isActive', e.target.checked)}
                            />
                            Ruangan Aktif (bisa dipesan)
                        </label>
                    </Field>
                )}

                <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: loading ? '#AAA' : '#1F4E79',
                            color: '#fff', padding: '9px 24px', border: 'none',
                            borderRadius: '4px', fontWeight: 700, fontSize: '15px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Ruangan'}
                    </button>
                    <Link
                        to="/rooms"
                        style={{ padding: '9px 20px', borderRadius: '4px', backgroundColor: '#6C757D', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>{label}</label>
            {children}
            {error && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#DC3545' }}>{error}</p>}
        </div>
    );
}

function inp(hasError: boolean): React.CSSProperties {
    return {
        width: '100%', padding: '8px 12px',
        border: `1px solid ${hasError ? '#DC3545' : '#CCC'}`,
        borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box',
    };
}
