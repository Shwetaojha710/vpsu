import { useState } from 'react';
import { api } from '../api';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  async function save(e) {
    e.preventDefault();
    const res = await api('/auth/password', {
      method: 'PUT',
      body: { oldPassword: oldPassword, newPassword: newPassword }
    });
    if (res.status) {
      alert('Saved');
      setOldPassword('');
      setNewPassword('');
    } else {
      alert(res.message);
    }
  }

  return (
    <div>
      <div className="page-head">
        <h2>Change Password</h2>
      </div>
      <form className="card form" onSubmit={save}>
        <div className="form-group">
          <label>Old password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={function (e) { setOldPassword(e.target.value); }}
            required
          />
        </div>
        <div className="form-group">
          <label>New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={function (e) { setNewPassword(e.target.value); }}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
}

export default ChangePassword;
