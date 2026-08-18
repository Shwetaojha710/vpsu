import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

function QuickLinkForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    title: '',
    url: '',
    icon: '',
    sort_order: 0,
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
      const res = await api('/quick-links/' + id);
      if (res.success) {
        setForm({
          title: res.data.title || '',
          url: res.data.url || '',
          icon: res.data.icon || '',
          sort_order: res.data.sort_order || 0,
          is_active: res.data.is_active
        });
      }
    }
    load();
  }, [id, isEdit]);

  async function save(e) {
    e.preventDefault();
    const res = await api(isEdit ? '/quick-links/' + id : '/quick-links', {
      method: isEdit ? 'PUT' : 'POST',
      body: {
        title: form.title,
        url: form.url,
        icon: form.icon,
        sort_order: Number(form.sort_order),
        is_active: form.is_active
      }
    });
    if (res.success) {
      alert('Saved');
      navigate('/quick-links');
    } else {
      alert(res.message);
    }
  }

  return (
    <div>
      <div className="page-head">
        <h2>{isEdit ? 'Edit Link' : 'Add Link'}</h2>
      </div>
      <form className="card form" onSubmit={save}>
        <div className="form-group">
          <label>Title</label>
          <input value={form.title} onChange={function (e) { setField('title', e.target.value); }} required />
        </div>
        <div className="form-group">
          <label>URL</label>
          <input value={form.url} onChange={function (e) { setField('url', e.target.value); }} required />
        </div>
        <div className="form-group">
          <label>Icon name</label>
          <input value={form.icon} onChange={function (e) { setField('icon', e.target.value); }} />
        </div>
        <div className="form-group">
          <label>Sort order</label>
          <input type="number" value={form.sort_order} onChange={function (e) { setField('sort_order', e.target.value); }} />
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

export default QuickLinkForm;
