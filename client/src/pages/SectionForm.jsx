import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

function SectionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    name: '',
    name_hi: '',
    type: 'faculty',
    slug: '',
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
      const res = await api('/sections/' + id);
      if (res.status) {
        setForm({
          name: res.data.name || '',
          name_hi: res.data.name_hi || '',
          type: res.data.type || 'faculty',
          slug: res.data.slug || '',
          sort_order: res.data.sort_order || 0,
          is_active: res.data.is_active
        });
      }
    }
    load();
  }, [id, isEdit]);

  async function save(e) {
    e.preventDefault();
    const res = await api(isEdit ? '/sections/' + id : '/sections', {
      method: isEdit ? 'PUT' : 'POST',
      body: form
    });
    if (res.status) {
      alert('Saved');
      navigate('/sections');
    } else {
      alert(res.message);
    }
  }

  return (
    <div>
      <div className="page-head">
        <h2>{isEdit ? 'Edit Section' : 'Add Section'}</h2>
      </div>
      <form className="card form" onSubmit={save}>
        <div className="form-group">
          <label>Name</label>
          <input value={form.name} onChange={function (e) { setField('name', e.target.value); }} required />
        </div>
        <div className="form-group">
          <label>Name (Hindi)</label>
          <input value={form.name_hi} onChange={function (e) { setField('name_hi', e.target.value); }} />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={form.type} onChange={function (e) { setField('type', e.target.value); }}>
            <option value="faculty">faculty</option>
            <option value="department">department</option>
            <option value="cell">cell</option>
            <option value="institute">institute</option>
            <option value="other">other</option>
          </select>
        </div>
        {form.slug ? <div className="hint">URL slug (auto): {form.slug}</div> : (
          <div className="hint">Slug will be created automatically from the name.</div>
        )}
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

export default SectionForm;
