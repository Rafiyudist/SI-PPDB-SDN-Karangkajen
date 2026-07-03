import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { colors, fonts, typography, components } from '../utils/designTokens';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div style={styles.hero}>
      <h1 style={styles.title}>Sistem Informasi PPDB</h1>
      <h2 style={styles.subtitle}>SDN Karangkajen</h2>
      <p style={styles.desc}>
        Selamat datang di portal Penerimaan Peserta Didik Baru (PPDB) SDN Karangkajen.
        Silakan daftar atau masuk untuk memulai proses pendaftaran.
      </p>
      <div style={styles.buttons}>
        <button
          style={components.btn.primary}
          onClick={() => router.push('/register')}
          onMouseEnter={e => { e.target.style.background = colors.primaryDark; }}
          onMouseLeave={e => { e.target.style.background = colors.primary; }}
        >Daftar Baru</button>
        <button style={styles.btnOutline} onClick={() => router.push('/login')}>Masuk</button>
      </div>
    </div>
  );
}

const styles = {
  hero: {
    textAlign: 'center',
    padding: '80px 16px 40px',
    fontFamily: fonts.family,
  },
  title: {
    ...typography.h1,
    margin: '0 0 8px',
  },
  subtitle: {
    ...typography.h2,
    color: colors.primary,
    margin: '0 0 24px',
  },
  desc: {
    ...typography.body,
    color: colors.textSecondary,
    maxWidth: 500,
    margin: '0 auto 32px',
    lineHeight: 1.6,
  },
  buttons: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnOutline: {
    background: colors.cardBg,
    color: colors.primary,
    border: `1px solid ${colors.primary}`,
    padding: '10px 24px',
    borderRadius: 6,
    fontSize: 14,
    cursor: 'pointer',
    fontFamily: fonts.family,
  },
};
