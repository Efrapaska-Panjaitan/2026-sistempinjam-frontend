import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import bookingService from '../services/bookingService';
import StatusBadge from '../components/StatusBadge';
import type { Booking, BookingStatus } from '../types/booking';

function formatDateTime(iso: string): string {
    return new Date(iso).toLocaleString('id-ID', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export default function BookingDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [booking, setBooking]     = useState<Booking | null>(null);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState('');
    const [statusLoading, setStatusLoading] = useState(false);
    const [successMsg, setSuccessMsg]       = useState('');

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const data = await bookingService.getById(Number(id));
                setBooking(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Gagal memuat data.');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleStatusChange = async (newStatus: BookingStatus) => {
        if (!booking) return;
        if (!confirm(`Ubah status menjadi "${newStatus}"?`)) return;
        setStatusLoading(true);
        setError('');
        try {
            await bookingService.updateStatus(booking.id, newStatus);
            setBooking({ ...booking, status: newStatus });
            setSuccessMsg(`Status berhasil diubah menjadi ${newStatus}.`);
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal mengubah status.');
        } finally {
            setStatusLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!booking) return;
        if (!confirm(`Hapus booking milik "${booking.borrowerName}"?`)) return;
        try {
            await bookingService.delete(booking.id);
            navigate('/bookings');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal menghapus.');
        }
    };

    if (loading) return <div style={{ padding: '32px' }}>Memuat data...</div>;
    if (!booking) return <div style={{ padding: '32px', color: 'red' }}>{error || 'Booking tidak ditemukan.'}</div>;

    return (
        <div style={{ padding: '24px', maxWidth: '700px' }}>
            {/* Back */}
            <Link to="/bookings" style={{ color: '#1F4E79', textDecoration: 'none', fontSize: '14px' }}>
                ← Kembali ke Daftar
            </Link>

            <h1 style={{ fontSize: '22px', margin: '16px 0 4px' }}>Detail Peminjaman</h1>
            <p style={{ color: '#666', fontSize: '13px', margin: '0 0 24px' }}>
                Dibuat: {formatDate(booking.createdAt)} &nbsp;|&nbsp;
                Diperbarui: {formatDate(booking.updatedAt)}
            </p>

            {error      && <div style={alertStyle('danger')}>{error}</div>}
            {successMsg && <div style={alertStyle('success')}>{successMsg}</div>}

            {/* Info Card */}
            <div style={cardStyle}>
                <Row label="Nama Peminjam" value={booking.borrowerName} />
                <Row label="Keperluan"     value={booking.purposeOfUse} />
                <Row label="Ruangan">
                    <strong>{booking.roomCode}</strong> — {booking.roomName} ({booking.building})
                </Row>
                <Row label="Waktu Mulai"   value={formatDateTime(booking.startTime)} />
                <Row label="Waktu Selesai" value={formatDateTime(booking.endTime)} />
                <Row label="Catatan"       value={booking.notes || '-'} />
                <Row label="Status">
                    <StatusBadge status={booking.status} />
                </Row>
            </div>

            {/* Status Actions */}
            <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Ubah Status Peminjaman</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {(['Pending', 'Approved', 'Rejected'] as BookingStatus[]).map((s) => (
                        <button
                            key={s}
                            onClick={() => handleStatusChange(s)}
                            disabled={booking.status === s || statusLoading}
                            style={{
                                padding: '7px 18px',
                                border: 'none',
                                borderRadius: '4px',
                                fontWeight: 600,
                                fontSize: '14px',
                                cursor: booking.status === s ? 'not-allowed' : 'pointer',
                                backgroundColor:
                                    s === 'Approved' ? '#28A745' :
                                        s === 'Rejected' ? '#DC3545' :
                                            '#FFC107',
                                color: s === 'Pending' ? '#333' : '#fff',
                                opacity: booking.status === s ? 0.45 : 1,
                            }}
                        >
                            {s === 'Approved' ? '✓ Setujui' : s === 'Rejected' ? '✗ Tolak' : '⟳ Set Pending'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '28px', display: 'flex', gap: '10px' }}>
                {booking.status === 'Pending' && (
                    <Link
                        to={`/bookings/${booking.id}/edit`}
                        style={{
                            backgroundColor: '#FFC107', color: '#333',
                            padding: '8px 20px', borderRadius: '4px',
                            fontWeight: 600, textDecoration: 'none', fontSize: '14px',
                        }}
                    >
                        ✏️ Edit
                    </Link>
                )}
                <button onClick={handleDelete} style={deleteBtnStyle}>
                    🗑 Hapus
                </button>
            </div>
        </div>
    );
}

// ── Helpers ───────────────────────────────────────────────────────────────

function Row({ label, value, children }: {
    label: string;
    value?: string;
    children?: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', borderBottom: '1px solid #EEE', padding: '10px 0' }}>
            <div style={{ width: '160px', color: '#666', fontWeight: 600, fontSize: '14px', flexShrink: 0 }}>
                {label}
            </div>
            <div style={{ fontSize: '14px' }}>
                {children ?? value}
            </div>
        </div>
    );
}

const cardStyle: React.CSSProperties = {
    border: '1px solid #DEE2E6',
    borderRadius: '6px',
    padding: '4px 20px',
    backgroundColor: '#fff',
};

function alertStyle(type: 'danger' | 'success'): React.CSSProperties {
    const map = {
        danger:  { bg: '#F8D7DA', color: '#721C24', border: '#F5C6CB' },
        success: { bg: '#D4EDDA', color: '#155724', border: '#C3E6CB' },
    };
    return {
        backgroundColor: map[type].bg,
        color: map[type].color,
        border: `1px solid ${map[type].border}`,
        padding: '10px 14px',
        borderRadius: '4px',
        marginBottom: '12px',
        fontSize: '14px',
    };
}

const deleteBtnStyle: React.CSSProperties = {
    backgroundColor: '#DC3545',
    color: '#fff',
    padding: '8px 20px',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
};
