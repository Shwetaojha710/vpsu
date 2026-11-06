import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api';

function SectionPhotoForm() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [sections, setSections] = useState([]);
  const [file, setFile] = useState(null);
  const [oldImage, setOldImage] = useState('');
  const [form, setForm] = useState({
    section_id: params.get('section') || '',
    title: '',
    title_hi: ''
  });

  function setField(name, value) {
    setForm(function (old) {
      return Object.assign({}, old, { [name]: value });
    });
  }

  useEffect(function () {
    async function load() {
      const sec = await api('/sections');
      if (sec.success) setSections(sec.data);
      if (!isEdit) return;
      const res = await api('/section-photos/' + id);
      if (res.status) {
        setForm({
          section_id: String(res.data.section_id || ''),
          title: res.data.title || '',
          title_hi: res.data.title_hi || ''
        });
        setOldImage(res.data.image || '');
      }
    }
    load();
  }, [id, isEdit]);

  async function save(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('section_id', form.section_id);
    fd.append('title', form.title);
    fd.append('title_hi', form.title_hi);
    if (file) fd.append('image', file);
    const res = await api(isEdit ? '/section-photos/' + id : '/section-photos', {
      method: isEdit ? 'PUT' : 'POST',
      body: fd
    });
    if (res.status) {
      alert('Saved');
      navigate('/section-photos' + (form.section_id ? '?section=' + form.section_id : ''));
    } else {
      alert(res.message);
    }
  }

  return (
    <div>
      <div className="page-head">
        <h2>{isEdit ? 'Edit Department Photo' : 'Add Department Photo'}</h2>
      </div>
      <form className="card form" onSubmit={save}>
        <div className="form-group">
          <label>Department / Section</label>
          <select
            value={form.section_id}
            onChange={function (e) { setField('section_id', e.target.value); }}
            required
          >
            <option value="">-- choose --</option>
            {sections.map(function (s) {
              return <option key={s.id} value={s.id}>{s.name}</option>;
            })}
          </select>
        </div>
        <div className="form-group">
          <label>Title (English)</label>
          <input value={form.title} onChange={function (e) { setField('title', e.target.value); }} required />
        </div>
        <div className="form-group">
          <label>Title (Hindi)</label>
          <input value={form.title_hi} onChange={function (e) { setField('title_hi', e.target.value); }} />
        </div>
        <div className="form-group">
          <label>Photo</label>
          <input type="file" accept="image/*" onChange={function (e) { setFile(e.target.files[0]); }} />
          {oldImage ? <div className="hint">Current file: {oldImage}</div> : null}
        </div>
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
}

export default SectionPhotoForm;
