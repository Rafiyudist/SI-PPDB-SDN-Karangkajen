import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { apiGet, apiPut, apiPost, apiDelete } from '../../utils/api';
import { colors, fonts, typography, components, badgeStyle } from '../../utils/designTokens';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('pendaftar');

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      router.replace('/login');
      return;
    }
  }, [user, authLoading]);

  if (authLoading) return <p style={components.loading}>Memuat...</p>;
  if (!user) return null;

  return (
    <div style={{ fontFamily: fonts.family }}>
      <h1 style={{ ...typography.h1, margin: '0 0 20px' }}>Dashboard Admin</h1>
      <div style={styles.tabBar}>
        <button
          style={activeTab === 'pendaftar' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('pendaftar')}
        >Data Pendaftar</button>
        <button
          style={activeTab === 'pengumuman' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('pengumuman')}
        >Kelola Pengumuman</button>
      </div>
      {activeTab === 'pendaftar' ? <DataPendaftar /> : <KelolaPengumuman />}
    </div>
  );
}

function DataPendaftar() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchList(); }, []);

  async function fetchList() {
    try {
      const endpoint = filter ? `/api/pendaftar?status=${filter}` : '/api/pendaftar';
      const data = await apiGet(endpoint);
      setList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDetail(id) {
    try {
      setError('');
      const data = await apiGet(`/api/pendaftar/${id}`);
      setSelected(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleVerifikasi(id, status) {
    try {
      setError('');
      const catatan = prompt('Catatan (opsional):');
      await apiPut(`/api/pendaftar/${id}/status`, { status, catatan_admin: catatan || '' });
      setSuccess(`Status berhasil diubah menjadi ${status === 'diverifikasi' ? 'diverifikasi' : 'ditolak'}.`);
      setSelected(null);
      await fetchList();
    } catch (err) {
      setError(err.message);
    }
  }

  function getStatusLabel(s) {
    if (s === 'menunggu') return 'Menunggu';
    if (s === 'diverifikasi') return 'Diverifikasi';
    if (s === 'ditolak') return 'Ditolak';
    return s;
  }

  useEffect(() => {
    if (filter !== undefined) fetchList();
  }, [filter]);

  return (
    <div>
      {error && <div style={components.alertError}>{error}</div>}
      {success && <div style={components.alertSuccess}>{success}</div>}

      <div style={{ marginBottom: 16 }}>
        <label style={{ ...components.field.label, display: 'inline', marginRight: 8 }}>Filter Status:</label>
        <select style={{ ...components.input, width: 'auto', display: 'inline' }} value={filter} onChange={e => { setFilter(e.target.value); }}>
          <option value="">Semua</option>
          <option value="menunggu">Menunggu</option>
          <option value="diverifikasi">Diverifikasi</option>
          <option value="ditolak">Ditolak</option>
        </select>
        <button
          style={{ ...components.btn.small, marginLeft: 8 }}
          onClick={fetchList}
          onMouseEnter={e => e.target.style.background = colors.primaryDark}
          onMouseLeave={e => e.target.style.background = colors.primary}
        >Terapkan</button>
      </div>

      {loading ? (
        <p style={components.loading}>Memuat...</p>
      ) : list.length === 0 ? (
        <div style={components.card}><p style={components.emptyText}>Tidak ada data.</p></div>
      ) : (
        <table style={components.table}>
          <thead>
            <tr>
              <th style={components.th}>Nama Siswa</th>
              <th style={components.th}>Email Ortu</th>
              <th style={components.th}>Status</th>
              <th style={components.th}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map(item => (
              <tr key={item.id}>
                <td style={components.td}>{item.nama_siswa}</td>
                <td style={components.td}>{item.email_ortu}</td>
                <td style={components.td}><span style={badgeStyle(item.status)}>{getStatusLabel(item.status)}</span></td>
                <td style={components.td}>
                  <button
                    style={components.btn.small}
                    onClick={() => fetchDetail(item.id)}
                    onMouseEnter={e => e.target.style.background = colors.primaryDark}
                    onMouseLeave={e => e.target.style.background = colors.primary}
                  >Periksa Berkas</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <div style={{ ...components.card, marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ ...typography.h3, margin: 0 }}>Detail Pendaftar</h3>
            <button
              style={components.btn.secondary}
              onClick={() => setSelected(null)}
              onMouseEnter={e => e.target.style.opacity = '0.8'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >Tutup</button>
          </div>
          <div style={styles.detailGrid}>
            <div style={{ fontSize: 14 }}><strong>Nama Siswa:</strong> {selected.nama_siswa}</div>
            <div style={{ fontSize: 14 }}><strong>Tempat, Tgl Lahir:</strong> {selected.tempat_lahir ? `${selected.tempat_lahir}, ` : ''}{selected.tanggal_lahir ? new Date(selected.tanggal_lahir).toLocaleDateString('id-ID') : '-'}</div>
            <div style={{ fontSize: 14 }}><strong>Jenis Kelamin:</strong> {selected.jenis_kelamin === 'L' ? 'Laki-laki' : selected.jenis_kelamin === 'P' ? 'Perempuan' : '-'}</div>
            <div style={{ fontSize: 14 }}><strong>Status:</strong> <span style={badgeStyle(selected.status)}>{getStatusLabel(selected.status)}</span></div>
            <div style={{ fontSize: 14, gridColumn: '1 / -1' }}><strong>Alamat:</strong> {selected.alamat || '-'}</div>
            <div style={{ fontSize: 14 }}><strong>Ayah:</strong> {selected.nama_ayah || '-'}</div>
            <div style={{ fontSize: 14 }}><strong>Ibu:</strong> {selected.nama_ibu || '-'}</div>
            <div style={{ fontSize: 14 }}><strong>No. HP:</strong> {selected.no_hp || '-'}</div>
            <div style={{ fontSize: 14 }}><strong>Asal Sekolah:</strong> {selected.asal_sekolah || '-'}</div>
          </div>

          <h4 style={{ ...typography.h3, margin: '16px 0 8px' }}>Berkas Pendukung</h4>
          {(!selected.dokumen || selected.dokumen.length === 0) ? (
            <p style={components.emptyText}>Belum ada berkas.</p>
          ) : (
            <table style={components.table}>
              <thead>
                <tr><th style={components.th}>Jenis</th><th style={components.th}>Nama File</th><th style={components.th}>Aksi</th></tr>
              </thead>
              <tbody>
                {selected.dokumen.map(d => (
                  <tr key={d.id}>
                    <td style={components.td}>{d.jenis_dokumen.replace(/_/g, ' ')}</td>
                    <td style={components.td}>{d.nama_file}</td>
                    <td style={components.td}>
                      <a style={{ color: colors.primary, fontSize: 13 }} href={`${API_BASE}/api/pendaftar/dokumen/${d.id}/download`} target="_blank" rel="noreferrer">Lihat Berkas</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button
              style={components.btn.success}
              onClick={() => handleVerifikasi(selected.id, 'diverifikasi')}
              onMouseEnter={e => e.target.style.background = '#236B26'}
              onMouseLeave={e => e.target.style.background = colors.success}
            >Verifikasi & Terima</button>
            <button
              style={components.btn.danger}
              onClick={() => handleVerifikasi(selected.id, 'ditolak')}
              onMouseEnter={e => e.target.style.background = '#A02020'}
              onMouseLeave={e => e.target.style.background = colors.danger}
            >Tolak</button>
          </div>
        </div>
      )}
    </div>
  );
}

function KelolaPengumuman() {
  const [list, setList] = useState([]);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchList(); }, []);

  async function fetchList() {
    try {
      const data = await apiGet('/api/pengumuman');
      setList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await apiPost('/api/pengumuman', { judul, isi });
      setSuccess('Pengumuman berhasil dipublikasikan.');
      setJudul('');
      setIsi('');
      await fetchList();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Hapus pengumuman ini?')) return;
    try {
      await apiDelete(`/api/pengumuman/${id}`);
      setSuccess('Pengumuman berhasil dihapus.');
      await fetchList();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      {error && <div style={components.alertError}>{error}</div>}
      {success && <div style={components.alertSuccess}>{success}</div>}

      <div style={components.card}>
        <h3 style={{ ...typography.h3, margin: '0 0 16px' }}>Buat Pengumuman Baru</h3>
        <form onSubmit={handleCreate}>
          <div style={{ marginBottom: 14 }}>
            <label style={components.field.label}>Judul</label>
            <input style={components.input} required value={judul} onChange={e => setJudul(e.target.value)} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={components.field.label}>Isi Pengumuman</label>
            <textarea style={{ ...components.input, minHeight: 100, resize: 'vertical' }} required value={isi} onChange={e => setIsi(e.target.value)} />
          </div>
          <button
            type="submit"
            disabled={submitting}
            style={submitting ? components.btn.disabled : components.btn.primary}
            onMouseEnter={e => { if (!submitting) e.target.style.background = colors.primaryDark; }}
            onMouseLeave={e => { if (!submitting) e.target.style.background = colors.primary; }}
          >{submitting ? 'Memuat...' : 'Publikasikan'}</button>
        </form>
      </div>

      <h3 style={{ ...typography.h3, margin: '20px 0 12px' }}>Daftar Pengumuman</h3>
      {loading ? (
        <p style={components.loading}>Memuat...</p>
      ) : list.length === 0 ? (
        <div style={components.card}><p style={components.emptyText}>Belum ada pengumuman.</p></div>
      ) : (
        list.map(item => (
          <div key={item.id} style={components.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ ...typography.h3, margin: '0 0 6px' }}>{item.judul}</h4>
                <p style={{ ...typography.body, margin: '0 0 6px' }}>{item.isi}</p>
                <p style={{ ...typography.small, margin: 0 }}>
                  {new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  {item.dibuat_oleh_nama ? ` — oleh ${item.dibuat_oleh_nama}` : ''}
                </p>
              </div>
              <button
                style={components.btn.dangerSmall}
                onClick={() => handleDelete(item.id)}
                onMouseEnter={e => e.target.style.background = '#A02020'}
                onMouseLeave={e => e.target.style.background = colors.danger}
              >Hapus</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  tabBar: {
    display: 'flex',
    gap: 0,
    marginBottom: 20,
  },
  tab: {
    padding: '10px 20px',
    border: `1px solid ${colors.inputBorder}`,
    background: colors.cardBg,
    color: colors.textPrimary,
    cursor: 'pointer',
    fontSize: 14,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottom: 0,
    fontFamily: fonts.family,
  },
  tabActive: {
    padding: '10px 20px',
    border: `1px solid ${colors.primary}`,
    background: colors.primary,
    color: '#fff',
    cursor: 'pointer',
    fontSize: 14,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottom: 0,
    fontFamily: fonts.family,
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
    fontSize: 14,
    marginBottom: 16,
  },
};
