import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

function StatForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ label: '', value: '', icon: '', sort_order: 0 });

  function setField(name, value) {
    setForm(function (old) {
      return Object.assign({}, old, { [name]: value });
    });
  }

  useEffect(function () {
    if (!isEdit) return;
    async function load() {
      const res = await api('/stats/' + id);
      if (res.success) {
        setForm({
          label: res.data.label || '',
          value: res.data.value || '',
          icon: res.data.icon || '',
          sort_order: res.data.sort_order || 0
        });
      }
    }
    load();
  }, [id, isEdit]);

  async function save(e) {
    e.preventDefault();
    const res = await api(isEdit ? '/stats/' + id : '/stats', {
      method: isEdit ? 'PUT' : 'POST',
      body: {
        label: form.label,
        value: form.value,
        icon: form.icon,
        sort_order: Number(form.sort_order)
      }
    });
    if (res.success) {
      alert('Saved');
      navigate('/stats');
    } else {
      alert(res.message);
    }
  }

  return (
    <div>
      <div className="page-head">
        <h2>{isEdit ? 'Edit Stat' : 'Add Stat'}</h2>
      </div>
      <form className="card form" onSubmit={save}>
        <div className="form-group">
          <label>Label</label>
          <input value={form.label} onChange={function (e) { setField('label', e.target.value); }} required />
        </div>
        <div className="form-group">
          <label>Value</label>
          <input value={form.value} onChange={function (e) { setField('value', e.target.value); }} required />
        </div>
        <div className="form-group">
          <label>Icon name</label>
          <input value={form.icon} onChange={function (e) { setField('icon', e.target.value); }} />
        </div>
        <div className="form-group">
          <label>Sort order</label>
          <input type="number" value={form.sort_order} onChange={function (e) { setField('sort_order', e.target.value); }} />
        </div>
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
}

export default StatForm;
