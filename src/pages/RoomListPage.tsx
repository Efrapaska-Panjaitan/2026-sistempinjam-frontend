import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import roomService from '../services/roomService';
import type { Room } from '../types/booking';

export default function RoomListPage() {
    const navigate = useNavigate();

    const [rooms, setRooms]     = useState<Room[]>([]);
    const [search, setSearch]   = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');

    const loadRooms = useCallback(async (q?: string) => {
        setLoading(true);
        setError('');
        try {
            const data = await roomService.getAll(q);
            setRooms(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal memuat data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRooms(search || undefined);
    }, [search, loadRooms]);

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Hapus ruangan "${name}"?\nPastikan tidak ada booking Pending di ruangan ini.`)) return;
        try {
            await roomService.delete(id);
            loadRooms(search || undefined);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Gagal menghapus.');
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0, fontSize: '22px' }}>Daftar Ruangan</h1>
                <button
                    onClick={() => navigate('/rooms/new')}
                    style={primaryBtn}
                >
                    + Tambah Ruangan
                </button>
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder="Cari nama, kode, atau gedung..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: '7px 12px', border: '1px solid #CCC', borderRadius: '4px', fontSize: '14px', width: '280px', marginBottom: '16px' }}
            />

            {error && (
                <div style={{ backgroundColor: '#F8D7DA', color: '#721C24', padding: '10px 14px', borderRadius: '4px', marginBottom: '12px', border: '1px solid #F5C6CB', fontSize: '14px' }}>
                    {error}
                </div>
            )}

            {loading && <p style={{ color: '#666' }}>Memuat data...</p>}

            {!loading && (
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #DEE2E6', fontSize: '14px' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#1F4E79', color: '#fff' }}>
                        <th style={th}>No</th>
                        <th style={th}>Kode</th>
                        <th style={th}>Nama Ruangan</th>
                        <th style={th}>Gedung / Lantai</th>
                        <th style={th}>Kapasitas</th>
                        <th style={th}>Status</th>
                        <th style={th}>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rooms.length === 0 ? (
                        <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
                                Tidak ada data ruangan.
                            </td>
                        </tr>
                    ) : (
                        rooms.map((r, i) => (
                            <tr key={r.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#F8F9FA' }}>
                                <td style={td}>{i + 1}</td>
                                <td style={td}><strong>{r.roomCode}</strong></td>
                                <td style={td}>{r.name}</td>
                                <td style={td}>{r.building}{r.floor ? ` — Lt. ${r.floor}` : ''}</td>
                                <td style={td}>{r.capacity} orang</td>
                                <td style={td}>
                    <span style={{
                        padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                        backgroundColor: r.isActive ? '#D4EDDA' : '#F8D7DA',
                        color: r.isActive ? '#155724' : '#721C24',
                    }}>
                      {r.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                                </td>
                                <td style={{ ...td, whiteSpace: 'nowrap' }}>
                                    <button
                                        onClick={() => navigate(`/rooms/${r.id}/edit`)}
                                        style={{ ...editBtn, marginRight: '6px' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(r.id, r.name)}
                                        style={deleteBtn}
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const th: React.CSSProperties = { padding: '10px 12px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '10px 12px', borderBottom: '1px solid #DEE2E6', verticalAlign: 'middle' };
const primaryBtn: React.CSSProperties = { backgroundColor: '#1F4E79', color: '#fff', padding: '7px 16px', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' };
const editBtn: React.CSSProperties   = { backgroundColor: '#FFC107', color: '#333', padding: '3px 10px', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' };
const deleteBtn: React.CSSProperties = { backgroundColor: '#DC3545', color: '#fff', padding: '3px 10px', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' };
