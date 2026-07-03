import Navbar from './Navbar';
import { colors, fonts } from '../utils/designTokens';

export default function Layout({ children }) {
  return (
    <div style={styles.wrapper}>
      <Navbar />
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: colors.pageBg,
  },
  main: {
    maxWidth: 960,
    margin: '0 auto',
    padding: '24px 16px',
  },
};
