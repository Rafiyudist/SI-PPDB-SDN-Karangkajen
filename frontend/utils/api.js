const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const isFormData = options.body instanceof FormData;
  if (isFormData) {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 403 && data.message?.includes('kedaluwarsa')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    throw { status: res.status, message: data.message || 'Terjadi kesalahan.' };
  }

  return data;
}

export function apiGet(endpoint) {
  return request(endpoint);
}

export function apiPost(endpoint, body) {
  const isFormData = body instanceof FormData;
  return request(endpoint, {
    method: 'POST',
    body: isFormData ? body : JSON.stringify(body),
  });
}

export function apiPut(endpoint, body) {
  return request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function apiDelete(endpoint) {
  return request(endpoint, { method: 'DELETE' });
}
