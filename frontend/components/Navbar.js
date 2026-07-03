import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { colors, fonts } from '../utils/designTokens';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push('/login');
  }

  const linkBase = {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: 14,
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: 6,
    fontFamily: fonts.family,
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <button style={styles.brand} onClick={() => router.push('/')}>
          SI-PPDB Sekolah
        </button>
        <div style={styles.links}>
          {!user ? (
            <>
              <button style={linkBase} onClick={() => router.push('/pengumuman')}>Pengumuman</button>
              <button style={linkBase} onClick={() => router.push('/login')}>Masuk</button>
              <button style={styles.linkAccent} onClick={() => router.push('/register')}>Daftar</button>
            </>
          ) : (
            <>
              <button style={linkBase} onClick={() => router.push('/pengumuman')}>Pengumuman</button>
              <button style={linkBase} onClick={() => router.push('/dashboard')}>Dashboard</button>
              <button style={styles.linkLogout} onClick={handleLogout}>Keluar</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: colors.primary,
    padding: '0 16px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: 960,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
  },
  brand: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: 0,
    fontFamily: fonts.family,
  },
  links: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  linkAccent: {
    background: '#fff',
    border: 'none',
    color: colors.primary,
    fontSize: 14,
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: 6,
    fontWeight: 600,
    fontFamily: fonts.family,
  },
  linkLogout: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.5)',
    color: '#fff',
    fontSize: 14,
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: 6,
    fontFamily: fonts.family,
  },
};
