import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

function CollegeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    name: '',
    code: '',
    district: '',
    type: 'affiliated',
    email: '',
    phone: '',
    is_active: true
  });

  function setField(name, value) {
    setForm(function (old) {
      return Object.assign({}, old, { [name]: value });
    });
  }

  useEffect(function () {
    if (!isEdit) return;
    async function load() {
      const res = await api('/colleges/' + id);
      if (res.success) setForm({
        name: res.data.name || '',
        code: res.data.code || '',
        district: res.data.district || '',
        type: res.data.type || 'affiliated',
        email: res.data.email || '',
        phone: res.data.phone || '',
        is_active: res.data.is_active
      });
    }
    load();
  }, [id, isEdit]);

  async function save(e) {
    e.preventDefault();
    const res = await api(isEdit ? '/colleges/' + id : '/colleges', {
      method: isEdit ? 'PUT' : 'POST',
      body: form
    });
    if (res.success) {
      alert('Saved');
      navigate('/colleges');
    } else {
      alert(res.message);
    }
  }

  return (
    <div>
      <div className="page-head">
        <h2>{isEdit ? 'Edit College' : 'Add College'}</h2>
      </div>
      <form className="card form" onSubmit={save}>
        <div className="form-group">
          <label>Name</label>
          <input value={form.name} onChange={function (e) { setField('name', e.target.value); }} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Code</label>
            <input value={form.code} onChange={function (e) { setField('code', e.target.value); }} />
          </div>
          <div className="form-group">
            <label>District</label>
            <input value={form.district} onChange={function (e) { setField('district', e.target.value); }} />
          </div>
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={form.type} onChange={function (e) { setField('type', e.target.value); }}>
            <option value="affiliated">affiliated</option>
            <option value="government">government</option>
            <option value="aided">aided</option>
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input value={form.email} onChange={function (e) { setField('email', e.target.value); }} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={form.phone} onChange={function (e) { setField('phone', e.target.value); }} />
          </div>
        </div>
        <label className="check">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={function (e) { setField('is_active', e.target.checked); }}
          />
          Active
        </label>
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
}

export default CollegeForm;
