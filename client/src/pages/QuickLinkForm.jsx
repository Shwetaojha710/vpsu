import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

function QuickLinkForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [file, setFile] = useState(null);
  const [oldIcon, setOldIcon] = useState('');
  const [form, setForm] = useState({
    title: '',
    url: '',
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
      if (res.status) {
        setForm({
          title: res.data.title || '',
          url: res.data.url || '',
          sort_order: res.data.sort_order || 0,
          is_active: res.data.is_active
        });
        setOldIcon(res.data.icon || '');
      }
    }
    load();
  }, [id, isEdit]);

  async function save(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('url', form.url);
    fd.append('sort_order', form.sort_order);
    fd.append('is_active', form.is_active ? 'true' : 'false');
    if (file) fd.append('icon', file);

    const res = await api(isEdit ? '/quick-links/' + id : '/quick-links', {
      method: isEdit ? 'PUT' : 'POST',
      body: fd
    });
    if (res.status) {
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
          <label>Icon image</label>
          <input type="file" accept="image/*" onChange={function (e) { setFile(e.target.files[0]); }} />
          {oldIcon ? (
            <div className="hint">
              Current: {oldIcon}
              <div style={{ marginTop: 8 }}>
                <img className="preview" src={'/uploads/' + oldIcon} alt="" />
              </div>
            </div>
          ) : null}
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
