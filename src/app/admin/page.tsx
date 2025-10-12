import BeatTable from '@/components/BeatTable';
import Link from 'next/link';
import '@/styles/admin-page-styles/admin.css';

export default function AdminPage() {
  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/admin/upload" className="upload-link">
          Upload New Beat
        </Link>
      </div>
      <BeatTable />
    </div>
  );
}
