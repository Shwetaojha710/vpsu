import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

function goToList(navigate, parentId) {
  if (parentId) navigate('/menus/' + parentId + '/children');
  else navigate('/menus');
}

function MenuForm() {
  const { id, parentId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [savedParentId, setSavedParentId] = useState(parentId || null);
  const [form, setForm] = useState({
    title: '',
    title_hi: '',
    url: '#',
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
      const res = await api('/menus/' + id);
      if (res.success) {
        setForm({
          title: res.data.title || '',
          title_hi: res.data.title_hi || '',
          url: res.data.url || '#',
          sort_order: res.data.sort_order || 0,
          is_active: res.data.is_active
        });
        setSavedParentId(res.data.parent_id);
      }
    }
    load();
  }, [id, isEdit]);

  async function save(e) {
    e.preventDefault();
    const res = await api(isEdit ? '/menus/' + id : '/menus', {
      method: isEdit ? 'PUT' : 'POST',
      body: {
        parent_id: parentId || null,
        title: form.title,
        title_hi: form.title_hi,
        url: form.url,
        sort_order: Number(form.sort_order),
        is_active: form.is_active
      }
    });
    if (res.success) {
      alert('Saved');
      goToList(navigate, isEdit ? savedParentId : parentId);
    } else {
      alert(res.message);
    }
  }

  return (
    <div>
      <div className="page-head">
        <h2>{isEdit ? 'Edit Menu' : (parentId ? 'Add Sub Menu' : 'Add Menu')}</h2>
      </div>
      <form className="card form" onSubmit={save}>
        <div className="form-group">
          <label>Title</label>
          <input value={form.title} onChange={function (e) { setField('title', e.target.value); }} required />
        </div>
        <div className="form-group">
          <label>Title (Hindi)</label>
          <input value={form.title_hi} onChange={function (e) { setField('title_hi', e.target.value); }} />
        </div>
        <div className="form-group">
          <label>URL</label>
          <input value={form.url} onChange={function (e) { setField('url', e.target.value); }} />
          <div className="hint">Use # if this item only opens more sub menus</div>
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
          Active (show on website)
        </label>
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
}

export default MenuForm;
