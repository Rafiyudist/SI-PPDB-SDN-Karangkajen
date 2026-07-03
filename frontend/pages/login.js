import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { colors, fonts, typography, components } from '../utils/designTokens';

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    router.push('/dashboard');
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Email atau password salah.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={components.card}>
        <h1 style={{ ...typography.h2, margin: '0 0 20px' }}>Masuk</h1>
        {error && <div style={components.alertError}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={components.field.label}>Email</label>
            <input style={components.input} type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@sekolah.sch.id" />
          </div>
          <div style={styles.field}>
            <label style={components.field.label}>Password</label>
            <input style={components.input} type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="******" />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={loading ? components.btn.disabled : components.btn.primary}
            onMouseEnter={e => { if (!loading) e.target.style.background = colors.primaryDark; }}
            onMouseLeave={e => { if (!loading) e.target.style.background = colors.primary; }}
          >{loading ? 'Memuat...' : 'Masuk'}</button>
        </form>
        <p style={styles.footer}>
          Belum punya akun?{' '}
          <button style={styles.linkBtn} onClick={() => router.push('/register')}>Daftar di sini</button>
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
