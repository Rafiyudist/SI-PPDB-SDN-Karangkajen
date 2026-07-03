export const colors = {
  primary: '#10367D',
  primaryDark: '#0C2B63',
  secondary: '#6C757D',
  success: '#2E7D32',
  successBg: '#E8F5E9',
  warning: '#856404',
  warningBg: '#FFF3CD',
  danger: '#C62828',
  dangerBg: '#FDECEA',
  pageBg: '#F4F6F9',
  cardBg: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#888888',
  inputBorder: '#CCCCCC',
  tableBorder: '#EEEEEE',
  disabled: '#AAAAAA',
  badgeDiverifikasiBg: '#D4EDDA',
  badgeDiverifikasiText: '#155724',
  badgeDitolakBg: '#F8D7DA',
};

export const fonts = {
  family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

export const typography = {
  h1: { fontSize: 30, fontWeight: 'bold', color: colors.textPrimary },
  h2: { fontSize: 21, fontWeight: 'bold', color: colors.textPrimary },
  h3: { fontSize: 17, fontWeight: 'bold', color: colors.textPrimary },
  body: { fontSize: 14, fontWeight: 'normal', color: colors.textPrimary },
  label: { fontSize: 13, fontWeight: 'bold', color: colors.textPrimary },
  small: { fontSize: 12, color: colors.textMuted },
};

export const components = {
  btn: {
    primary: {
      background: colors.primary,
      color: '#fff',
      border: 'none',
      padding: '10px 18px',
      borderRadius: 6,
      fontSize: 14,
      cursor: 'pointer',
    },
    secondary: {
      background: colors.secondary,
      color: '#fff',
      border: 'none',
      padding: '10px 18px',
      borderRadius: 6,
      fontSize: 14,
      cursor: 'pointer',
    },
    success: {
      background: colors.success,
      color: '#fff',
      border: 'none',
      padding: '8px 16px',
      borderRadius: 6,
      fontSize: 13,
      cursor: 'pointer',
    },
    danger: {
      background: colors.danger,
      color: '#fff',
      border: 'none',
      padding: '8px 16px',
      borderRadius: 6,
      fontSize: 13,
      cursor: 'pointer',
    },
    small: {
      background: colors.primary,
      color: '#fff',
      border: 'none',
      padding: '7px 14px',
      borderRadius: 6,
      fontSize: 12,
      cursor: 'pointer',
    },
    dangerSmall: {
      background: colors.danger,
      color: '#fff',
      border: 'none',
      padding: '7px 12px',
      borderRadius: 6,
      fontSize: 12,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    disabled: {
      background: colors.disabled,
      color: '#fff',
      border: 'none',
      padding: '10px 18px',
      borderRadius: 6,
      fontSize: 14,
      cursor: 'not-allowed',
    },
  },
  input: {
    width: '100%',
    padding: 10,
    fontSize: 14,
    border: `1px solid ${colors.inputBorder}`,
    borderRadius: 6,
    boxSizing: 'border-box',
  },
  field: {
    label: {
      display: 'block',
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 6,
      color: colors.textPrimary,
    },
  },
  card: {
    background: colors.cardBg,
    borderRadius: 10,
    padding: 24,
    marginBottom: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
  },
  th: {
    textAlign: 'left',
    padding: 10,
    fontWeight: 'bold',
    borderBottom: `1px solid ${colors.tableBorder}`,
  },
  td: {
    padding: 10,
    borderBottom: `1px solid ${colors.tableBorder}`,
  },
  alertError: {
    background: colors.dangerBg,
    color: colors.danger,
    padding: '10px 14px',
    borderRadius: 6,
    fontSize: 13,
    marginBottom: 16,
  },
  alertSuccess: {
    background: colors.successBg,
    color: colors.success,
    padding: '10px 14px',
    borderRadius: 6,
    fontSize: 13,
    marginBottom: 16,
  },
  loading: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
    color: colors.textMuted,
  },
  emptyText: {
    color: colors.textMuted,
    margin: 0,
    fontSize: 14,
  },
};

export function badgeStyle(status) {
  const base = { display: 'inline-block', padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 };
  if (status === 'menunggu') return { ...base, background: colors.warningBg, color: colors.warning };
  if (status === 'diverifikasi') return { ...base, background: colors.badgeDiverifikasiBg, color: colors.badgeDiverifikasiText };
  if (status === 'ditolak') return { ...base, background: colors.badgeDitolakBg, color: colors.danger };
  return base;
}
