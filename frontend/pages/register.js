import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { apiPost } from '../utils/api';
import { colors, fonts, typography, components } from '../utils/designTokens';

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    router.push('/dashboard');
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = await apiPost('/api/auth/register', { nama, email, password });
      setSuccess(data.message);
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Registrasi gagal.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={components.card}>
        <h1 style={{ ...typography.h2, margin: '0 0 20px' }}>Daftar Akun Baru</h1>
        {error && <div style={components.alertError}>{error}</div>}
        {success && <div style={components.alertSuccess}>{success}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={components.field.label}>Nama Lengkap</label>
            <input style={components.input} type="text" required value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama lengkap anda" />
          </div>
          <div style={styles.field}>
            <label style={components.field.label}>Email</label>
            <input style={components.input} type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="email@contoh.com" />
          </div>
          <div style={styles.field}>
            <label style={components.field.label}>Password (min. 6 karakter)</label>
            <input style={components.input} type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="******" />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={loading ? components.btn.disabled : components.btn.primary}
            onMouseEnter={e => { if (!loading) e.target.style.background = colors.primaryDark; }}
            onMouseLeave={e => { if (!loading) e.target.style.background = colors.primary; }}
          >{loading ? 'Memuat...' : 'Daftar'}</button>
        </form>
        <p style={styles.footer}>
          Sudah punya akun?{' '}
          <button style={styles.linkBtn} onClick={() => router.push('/login')}>Masuk di sini</button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', justifyContent: 'center', paddingTop: 40 },
  field: { marginBottom: 16 },
  footer: { textAlign: 'center', marginTop: 16, fontSize: 13, color: colors.textSecondary, fontFamily: fonts.family },
  linkBtn: { background: 'none', border: 'none', color: colors.primary, cursor: 'pointer', fontSize: 13, textDecoration: 'underline', padding: 0, fontFamily: fonts.family },
};
