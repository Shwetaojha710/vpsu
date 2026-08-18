// one function for all API calls
// if body is FormData we do not set JSON header (needed for file upload)

import { getToken, logout } from './auth';

export async function api(path, options = {}) {
  const headers = Object.assign({}, options.headers || {});
  const token = getToken();

  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }

  const isForm = options.body instanceof FormData;
  let body = options.body;

  // normal objects are sent as JSON
  if (!isForm && body && typeof body === 'object') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  try {
    const res = await fetch('/api' + path, {
      method: options.method || 'GET',
      headers: headers,
      body: body
    });

    const json = await res.json();

    // token expired or missing
    if (res.status === 401 && path !== '/auth/login') {
      logout();
      window.location.href = '/login';
    }

    return json;
  } catch (err) {
    return { success: false, message: 'Cannot connect to server. Is backend running?', data: null };
  }
}
