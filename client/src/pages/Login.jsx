import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { getToken, saveAdmin, saveToken } from '../auth';

function Login() {
  const navigate = useNavigate();
  if (getToken()) {
    return <Navigate to="/dashboard" replace />;
  }
  const [email, setEmail] = useState('admin@vpsu.ac.in');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    const res = await api('/auth/login', {
      method: 'POST',
      body: { email: email, password: password }
    });

    if (!res.success) {
      setError(res.message || 'Wrong email or password');
      return;
    }

    // save token so other pages can call protected APIs
    saveToken(res.data.token);
    saveAdmin(res.data.admin);
    navigate('/dashboard');
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={onSubmit}>
        <h2>VPSU Admin</h2>
        <p>Veer Bahadur Singh Purvanchal University, Jaunpur</p>
        {error ? <div className="error">{error}</div> : null}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={function (e) { setEmail(e.target.value); }}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={function (e) { setPassword(e.target.value); }}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
