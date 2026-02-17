import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import StatusBadge from '../components/StatusBadge';
import type { Booking, BookingStatus, BookingQueryParams } from '../types/booking';

// Helper: format datetime ke string yang mudah dibaca
function formatDateTime(iso: string): string {
    return new Date(iso).toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export default function BookingListPage() {
    const navigate = useNavigate();

    // State data
    const [bookings, setBookings]   = useState<Booking[]>([]);
    const [total, setTotal]         = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState('');

    // State filter & pagination
    const [search, setSearch]   = useState('');
    const [status, setStatus]   = useState<BookingStatus | ''>('');
    const [page, setPage]       = useState(1);
    const PAGE_SIZE = 10;

    // Fungsi load data dari API
    const loadBookings = useCallback(async (params: BookingQueryParams) => {
        setLoading(true);
        setError('');
        try {
            const res = await bookingService.getAll(params);
            setBookings(res.data);
            setTotal(res.total);
            setTotalPages(res.totalPages);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal memuat data.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load ulang saat filter atau page berubah
    useEffect(() => {
        loadBookings({ search, status: status || undefined, page, pageSize: PAGE_SIZE });
    }, [search, status, page, loadBookings]);

    // Handle hapus booking
    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Hapus booking milik "${name}"?`)) return;
        try {
            await bookingService.delete(id);
            // Reload halaman saat ini
            loadBookings({ search, status: status || undefined, page, pageSize: PAGE_SIZE });
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Gagal menghapus.');
        }
    };

    // Reset ke halaman 1 saat filter berubah
    const handleSearchChange = (val: string) => { setSearch(val); setPage(1); };
    const handleStatusChange = (val: BookingStatus | '') => { setStatus(val); setPage(1); };

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '22px' }}>Daftar Peminjaman</h1>
                    <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>{total} total data</p>
                </div>
                <button
                    onClick={() => navigate('/bookings/new')}
                    style={btnStyle('primary')}
                >
                    + Buat Peminjaman
                </button>
            </div>

            {/* Filter bar */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Cari nama / keperluan..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    style={inputStyle}
                />
                <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value as BookingStatus | '')}
                    style={{ ...inputStyle, width: '180px' }}
                >
                    <option value="">Semua Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            {/* Error */}
            {error && <div style={alertStyle}>{error}</div>}

            {/* Loading */}
            {loading && <p style={{ color: '#666' }}>Memuat data...</p>}

            {/* Table */}
            {!loading && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                        <thead>
                        <tr style={{ backgroundColor: '#1F4E79', color: '#fff' }}>
                            <th style={th}>No</th>
                            <th style={th}>Peminjam</th>
                            <th style={th}>Keperluan</th>
                            <th style={th}>Ruangan</th>
                            <th style={th}>Waktu Mulai</th>
                            <th style={th}>Waktu Selesai</th>
                            <th style={th}>Status</th>
                            <th style={th}>Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
                                    Tidak ada data peminjaman.
                                </td>
                            </tr>
                        ) : (
                            bookings.map((b, i) => (
                                <tr
                                    key={b.id}
                                    style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#F8F9FA' }}
                                >
                                    <td style={td}>{(page - 1) * PAGE_SIZE + i + 1}</td>
                                    <td style={td}>{b.borrowerName}</td>
                                    <td style={td}>{b.purposeOfUse}</td>
                                    <td style={td}>
                                        <strong>{b.roomCode}</strong>
                                        <br />
                                        <span style={{ fontSize: '12px', color: '#666' }}>{b.roomName} — {b.building}</span>
                                    </td>
                                    <td style={td}>{formatDateTime(b.startTime)}</td>
                                    <td style={td}>{formatDateTime(b.endTime)}</td>
                                    <td style={td}><StatusBadge status={b.status} /></td>
                                    <td style={{ ...td, whiteSpace: 'nowrap' }}>
                                        <Link to={`/bookings/${b.id}`} style={linkBtn('info')}>Detail</Link>
                                        {b.status === 'Pending' && (
                                            <Link to={`/bookings/${b.id}/edit`} style={linkBtn('warning')}>Edit</Link>
                                        )}
                                        <button
                                            onClick={() => handleDelete(b.id, b.borrowerName)}
                                            style={{ ...btnStyle('danger'), padding: '3px 10px', fontSize: '13px' }}
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'center' }}>
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={btnStyle(page === 1 ? 'disabled' : 'secondary')}
                    >
                        ← Prev
                    </button>
                    <span style={{ lineHeight: '34px', color: '#555' }}>
            Halaman {page} dari {totalPages}
          </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        style={btnStyle(page === totalPages ? 'disabled' : 'secondary')}
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
    padding: '7px 12px',
    border: '1px solid #CCC',
    borderRadius: '4px',
    fontSize: '14px',
    width: '260px',
};

const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    border: '1px solid #DEE2E6',
    fontSize: '14px',
};

const th: React.CSSProperties = {
    padding: '10px 12px',
    textAlign: 'left',
    fontWeight: 600,
    whiteSpace: 'nowrap',
};

const td: React.CSSProperties = {
    padding: '10px 12px',
    borderBottom: '1px solid #DEE2E6',
    verticalAlign: 'middle',
};

const alertStyle: React.CSSProperties = {
    backgroundColor: '#F8D7DA',
    color: '#721C24',
    padding: '10px 14px',
    borderRadius: '4px',
    marginBottom: '12px',
    border: '1px solid #F5C6CB',
};

function btnStyle(variant: 'primary' | 'secondary' | 'danger' | 'disabled'): React.CSSProperties {
    const colors: Record<string, React.CSSProperties> = {
        primary:   { backgroundColor: '#1F4E79', color: '#fff' },
        secondary: { backgroundColor: '#6C757D', color: '#fff' },
        danger:    { backgroundColor: '#DC3545', color: '#fff' },
        disabled:  { backgroundColor: '#E9ECEF', color: '#ADB5BD', cursor: 'not-allowed' },
    };
    return {
        ...colors[variant],
        padding: '7px 16px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: 600,
        cursor: variant === 'disabled' ? 'not-allowed' : 'pointer',
    };
}

function linkBtn(variant: 'info' | 'warning'): React.CSSProperties {
    const colors: Record<string, React.CSSProperties> = {
        info:    { backgroundColor: '#17A2B8', color: '#fff' },
        warning: { backgroundColor: '#FFC107', color: '#333' },
    };
    return {
        ...colors[variant],
        padding: '3px 10px',
        borderRadius: '4px',
        fontSize: '13px',
        fontWeight: 600,
        textDecoration: 'none',
        marginRight: '6px',
        display: 'inline-block',
    };
}
