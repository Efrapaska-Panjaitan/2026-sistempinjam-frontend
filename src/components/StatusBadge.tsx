import type { BookingStatus } from '../types/booking';

interface Props {
    status: BookingStatus;
}

// Warna latar & teks per status
const statusStyle: Record<BookingStatus, React.CSSProperties> = {
    Pending:  { backgroundColor: '#FFF3CD', color: '#856404', border: '1px solid #FFEAA7' },
    Approved: { backgroundColor: '#D4EDDA', color: '#155724', border: '1px solid #C3E6CB' },
    Rejected: { backgroundColor: '#F8D7DA', color: '#721C24', border: '1px solid #F5C6CB' },
};

export default function StatusBadge({ status }: Props) {
    return (
        <span
            style={{
                ...statusStyle[status],
                padding: '2px 10px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
            }}
        >
      {status}
    </span>
    );
}
