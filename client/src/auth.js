// save and read login token from localStorage

export function getToken() {
  return localStorage.getItem('vpsu_token');
}

export function saveToken(token) {
  localStorage.setItem('vpsu_token', token);
}

export function logout() {
  localStorage.removeItem('vpsu_token');
  localStorage.removeItem('vpsu_admin');
}

export function saveAdmin(admin) {
  localStorage.setItem('vpsu_admin', JSON.stringify(admin));
}

export function getAdmin() {
  try {
    return JSON.parse(localStorage.getItem('vpsu_admin') || 'null');
  } catch (err) {
    return null;
  }
}
