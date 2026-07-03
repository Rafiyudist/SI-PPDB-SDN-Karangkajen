import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { apiGet } from '../utils/api';
import { colors, fonts, typography, components, badgeStyle } from '../utils/designTokens';

export default function PengumumanPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [pengumuman, setPengumuman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    fetchPengumuman();
  }, [user, authLoading]);

  async function fetchPengumuman() {
    try {
      const data = await apiGet('/api/pengumuman');
      setPengumuman(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat pengumuman.');
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) return <p style={components.loading}>Memuat...</p>;
  if (!user) return null;

  return (
    <div style={styles.wrapper}>
      <h1 style={{ ...typography.h1, margin: '0 0 20px' }}>Pengumuman</h1>
      {error && <div style={components.alertError}>{error}</div>}
      {loading && <p style={components.loading}>Memuat...</p>}
      {!loading && pengumuman.length === 0 && !error && (
        <div style={components.card}>
          <p style={components.emptyText}>Belum ada pengumuman.</p>
        </div>
      )}
      {pengumuman.map(item => (
        <div key={item.id} style={components.card}>
          <h3 style={{ ...typography.h3, margin: '0 0 8px' }}>{item.judul}</h3>
          <p style={{ ...typography.body, margin: '0 0 8px', lineHeight: 1.6 }}>{item.isi}</p>
          <p style={{ ...typography.small, margin: 0 }}>
            {new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            {item.dibuat_oleh_nama ? ` — oleh ${item.dibuat_oleh_nama}` : ''}
          </p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  wrapper: { paddingTop: 8, fontFamily: fonts.family },
};
