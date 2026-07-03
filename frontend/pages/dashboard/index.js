import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { components } from '../../utils/designTokens';

export default function DashboardRouter() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role === 'admin') {
      router.replace('/dashboard/admin');
    } else {
      router.replace('/dashboard/ortu');
    }
  }, [user, loading]);

  return <p style={components.loading}>Memuat...</p>;
}
