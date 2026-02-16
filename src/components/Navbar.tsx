import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const { pathname } = useLocation();

    const linkStyle = (path: string): React.CSSProperties => ({
        color: pathname.startsWith(path) ? '#fff' : '#BDD7EE',
        textDecoration: 'none',
        padding: '6px 14px',
        borderRadius: '4px',
        fontWeight: pathname.startsWith(path) ? 700 : 400,
        backgroundColor: pathname.startsWith(path) ? 'rgba(255,255,255,0.2)' : 'transparent',
    });

    return (
        <nav
            style={{
                backgroundColor: '#1F4E79',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                height: '56px',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
        >
            {/* Brand */}
            <Link
                to="/"
                style={{ color: '#fff', fontWeight: 800, fontSize: '18px', textDecoration: 'none', marginRight: '24px' }}
            >
                Sistem Peminjaman Ruangan Kampus
            </Link>

            {/* Nav links */}
            <Link to="/bookings" style={linkStyle('/bookings')}>Peminjaman</Link>
            <Link to="/rooms"    style={linkStyle('/rooms')}>Ruangan</Link>
        </nav>
    );
}
