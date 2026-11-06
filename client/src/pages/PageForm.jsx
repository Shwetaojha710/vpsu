import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

function PageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    slug: '',
    title: '',
    title_hi: '',
    content: '',
    content_hi: '',
    is_published: true
  });

  function setField(name, value) {
    setForm(function (old) {
      return Object.assign({}, old, { [name]: value });
    });
  }

  useEffect(function () {
    if (!isEdit) return;
    async function load() {
      const res = await api('/pages/' + id);
      if (res.status) {
        setForm({
          slug: res.data.slug || '',
          title: res.data.title || '',
          title_hi: res.data.title_hi || '',
          content: res.data.content || '',
          content_hi: res.data.content_hi || '',
          is_published: res.data.is_published
        });
      }
    }
    load();
  }, [id, isEdit]);

  async function save(e) {
    e.preventDefault();
    const res = await api(isEdit ? '/pages/' + id : '/pages', {
      method: isEdit ? 'PUT' : 'POST',
      body: form
    });
    if (res.status) {
      alert('Saved');
      navigate('/pages');
    } else {
      alert(res.message);
    }
  }

  return (
    <div>
      <div className="page-head">
        <h2>{isEdit ? 'Edit Page' : 'Add Page'}</h2>
      </div>
      <form className="card form" onSubmit={save}>
        <div className="form-row">
          <div className="form-group">
            <label>Slug (example: about)</label>
            <input value={form.slug} onChange={function (e) { setField('slug', e.target.value); }} required />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input value={form.title} onChange={function (e) { setField('title', e.target.value); }} required />
          </div>
        </div>
        <div className="form-group">
          <label>Title (Hindi)</label>
          <input value={form.title_hi} onChange={function (e) { setField('title_hi', e.target.value); }} />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea value={form.content} onChange={function (e) { setField('content', e.target.value); }} />
        </div>
        <div className="form-group">
          <label>Content (Hindi)</label>
          <textarea value={form.content_hi} onChange={function (e) { setField('content_hi', e.target.value); }} />
        </div>
        <label className="check">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={function (e) { setField('is_published', e.target.checked); }}
          />
          Published
        </label>
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
}

export default PageForm;
