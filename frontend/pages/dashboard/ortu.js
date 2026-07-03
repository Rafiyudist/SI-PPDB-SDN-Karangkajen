import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { apiGet, apiPost } from '../../utils/api';
import { colors, fonts, typography, components, badgeStyle } from '../../utils/designTokens';

export default function OrtuDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [pendaftar, setPendaftar] = useState(null);
  const [dokumen, setDokumen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({ nama_siswa: '', tempat_lahir: '', tanggal_lahir: '', jenis_kelamin: '', alamat: '', nama_ayah: '', nama_ibu: '', no_hp: '', asal_sekolah: '' });
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadJenis, setUploadJenis] = useState('akta_lahir');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'ortu') {
      router.replace('/login');
      return;
    }
    fetchData();
  }, [user, authLoading]);

  async function fetchData() {
    try {
      const list = await apiGet('/api/pendaftar');
      if (list.length > 0) {
        const detail = await apiGet(`/api/pendaftar/${list[0].id}`);
        setPendaftar(detail);
        setDokumen(detail.dokumen || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitForm(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await apiPost('/api/pendaftar', form);
      setSuccess('Pendaftaran berhasil dikirim.');
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError('Pilih berkas terlebih dahulu.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('jenis_dokumen', uploadJenis);
      fd.append('file', file);
      await apiPost(`/api/pendaftar/${pendaftar.id}/dokumen`, fd);
      setSuccess('Berkas berhasil diunggah.');
      await fetchData();
      fileInputRef.current.value = '';
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  if (authLoading || loading) return <p style={components.loading}>Memuat...</p>;
  if (!user) return null;

  const btnPrimaryWithHover = {
    ...components.btn.primary,
    marginTop: 8,
  };

  return (
    <div style={{ fontFamily: fonts.family }}>
      {error && <div style={components.alertError}>{error}</div>}
      {success && <div style={components.alertSuccess}>{success}</div>}

      {!pendaftar ? (
        <div style={components.card}>
          <h2 style={{ ...typography.h2, margin: '0 0 16px' }}>Formulir Pendaftaran Siswa Baru</h2>
          <form onSubmit={handleSubmitForm}>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={components.field.label}>Nama Siswa *</label>
                <input style={components.input} name="nama_siswa" required value={form.nama_siswa} onChange={handleChange} />
              </div>
              <div style={styles.field}>
                <label style={components.field.label}>Tempat Lahir</label>
                <input style={components.input} name="tempat_lahir" value={form.tempat_lahir} onChange={handleChange} />
              </div>
              <div style={styles.field}>
                <label style={components.field.label}>Tanggal Lahir *</label>
                <input style={components.input} type="date" name="tanggal_lahir" required value={form.tanggal_lahir} onChange={handleChange} />
              </div>
              <div style={styles.field}>
                <label style={components.field.label}>Jenis Kelamin</label>
                <select style={components.input} name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange}>
                  <option value="">-- Pilih --</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div style={styles.fieldFull}>
                <label style={components.field.label}>Alamat</label>
                <textarea style={{ ...components.input, minHeight: 60, resize: 'vertical' }} name="alamat" value={form.alamat} onChange={handleChange} />
              </div>
              <div style={styles.field}>
                <label style={components.field.label}>Nama Ayah</label>
                <input style={components.input} name="nama_ayah" value={form.nama_ayah} onChange={handleChange} />
              </div>
              <div style={styles.field}>
                <label style={components.field.label}>Nama Ibu</label>
                <input style={components.input} name="nama_ibu" value={form.nama_ibu} onChange={handleChange} />
              </div>
              <div style={styles.field}>
                <label style={components.field.label}>No. HP</label>
                <input style={components.input} name="no_hp" value={form.no_hp} onChange={handleChange} />
              </div>
              <div style={styles.field}>
                <label style={components.field.label}>Asal Sekolah</label>
                <input style={components.input} name="asal_sekolah" value={form.asal_sekolah} onChange={handleChange} />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={submitting ? { ...components.btn.disabled, marginTop: 8 } : btnPrimaryWithHover}
              onMouseEnter={e => { if (!submitting) e.target.style.background = colors.primaryDark; }}
              onMouseLeave={e => { if (!submitting) e.target.style.background = colors.primary; }}
            >{submitting ? 'Memuat...' : 'Kirim Pendaftaran'}</button>
          </form>
        </div>
      ) : (
        <>
          <div style={components.card}>
            <h2 style={{ ...typography.h2, margin: '0 0 16px' }}>Status Pendaftaran</h2>
            <p style={{ ...typography.h3, margin: '0 0 8px' }}>{pendaftar.nama_siswa}</p>
            <span style={badgeStyle(pendaftar.status)}>{pendaftar.status}</span>
            {pendaftar.catatan_admin && (
              <div style={{ background: colors.warningBg, color: colors.warning, padding: '10px 14px', borderRadius: 6, fontSize: 13, marginTop: 12 }}>
                <strong>Catatan Admin:</strong> {pendaftar.catatan_admin}
              </div>
            )}
          </div>

          <div style={components.card}>
            <h2 style={{ ...typography.h2, margin: '0 0 16px' }}>Upload Berkas Persyaratan</h2>
            <form onSubmit={handleUpload} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 16 }}>
              <div style={{ flex: 1, minWidth: 150 }}>
                <label style={components.field.label}>Jenis Dokumen</label>
                <select style={components.input} value={uploadJenis} onChange={e => setUploadJenis(e.target.value)}>
                  <option value="akta_lahir">Akta Kelahiran</option>
                  <option value="kartu_keluarga">Kartu Keluarga</option>
                  <option value="foto">Pas Foto</option>
                  <option value="ijazah_skl">Ijazah/SKL</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
              <div style={{ flex: 2, minWidth: 200 }}>
                <label style={components.field.label}>File (PDF/JPG/PNG, max 5MB)</label>
                <input style={components.input} type="file" ref={fileInputRef} accept=".pdf,.jpg,.jpeg,.png" />
              </div>
              <button
                type="submit"
                disabled={uploading}
                style={uploading ? components.btn.disabled : { ...components.btn.primary, whiteSpace: 'nowrap' }}
                onMouseEnter={e => { if (!uploading) e.target.style.background = colors.primaryDark; }}
                onMouseLeave={e => { if (!uploading) e.target.style.background = colors.primary; }}
              >{uploading ? 'Memuat...' : 'Unggah Berkas'}</button>
            </form>

            <h3 style={{ ...typography.h3, margin: '16px 0 8px' }}>Berkas Terunggah</h3>
            {dokumen.length === 0 ? (
              <p style={components.emptyText}>Belum ada berkas.</p>
            ) : (
              <table style={components.table}>
                <thead>
                  <tr>
                    <th style={components.th}>Jenis Dokumen</th>
                    <th style={components.th}>Nama File</th>
                    <th style={components.th}>Tanggal Upload</th>
                  </tr>
                </thead>
                <tbody>
                  {dokumen.map(d => (
                    <tr key={d.id}>
                      <td style={components.td}>{d.jenis_dokumen.replace(/_/g, ' ')}</td>
                      <td style={components.td}>{d.nama_file}</td>
                      <td style={components.td}>{new Date(d.uploaded_at).toLocaleDateString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' },
  field: { marginBottom: 14 },
  fieldFull: { marginBottom: 14, gridColumn: '1 / -1' },
};
