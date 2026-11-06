import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api';

function ProfessorForm() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [sections, setSections] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [oldPhoto, setOldPhoto] = useState('');
  const [form, setForm] = useState({
    section_id: params.get('section') || '',
    name: '',
    name_hi: '',
    designation: '',
    designation_hi: '',
    email: '',
    phone: '',
    profile_text: '',
    profile_text_hi: '',
    sort_order: 0,
    is_active: true
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
      const res = await api('/professors/' + id);
      if (res.status) {
        setForm({
          section_id: String(res.data.section_id || ''),
          name: res.data.name || '',
          name_hi: res.data.name_hi || '',
          designation: res.data.designation || '',
          designation_hi: res.data.designation_hi || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          profile_text: res.data.profile_text || '',
          profile_text_hi: res.data.profile_text_hi || '',
          sort_order: res.data.sort_order || 0,
          is_active: res.data.is_active
        });
        setOldPhoto(res.data.photo || '');
      }
    }
    load();
  }, [id, isEdit]);

  async function save(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('section_id', form.section_id);
    fd.append('name', form.name);
    fd.append('name_hi', form.name_hi);
    fd.append('designation', form.designation);
    fd.append('designation_hi', form.designation_hi);
    fd.append('email', form.email);
    fd.append('phone', form.phone);
    fd.append('profile_text', form.profile_text);
    fd.append('profile_text_hi', form.profile_text_hi);
    fd.append('sort_order', form.sort_order);
    fd.append('is_active', form.is_active ? 'true' : 'false');
    if (photo) fd.append('photo', photo);

    const res = await api(isEdit ? '/professors/' + id : '/professors', {
      method: isEdit ? 'PUT' : 'POST',
      body: fd
    });
    if (res.status) {
      alert('Saved');
      navigate('/professors' + (form.section_id ? '?section=' + form.section_id : ''));
    } else {
      alert(res.message);
    }
  }

  return (
    <div>
      <div className="page-head">
        <h2>{isEdit ? 'Edit Professor' : 'Add Professor'}</h2>
      </div>
      <form className="card form" onSubmit={save}>
        <div className="form-group">
          <label>Select section (Faculty / Cell / ...)</label>
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
          <label>Name (English)</label>
          <input value={form.name} onChange={function (e) { setField('name', e.target.value); }} required />
        </div>
        <div className="form-group">
          <label>Name (Hindi)</label>
          <input value={form.name_hi} onChange={function (e) { setField('name_hi', e.target.value); }} />
        </div>
        <div className="form-group">
          <label>Designation (English)</label>
          <input value={form.designation} onChange={function (e) { setField('designation', e.target.value); }} />
        </div>
        <div className="form-group">
          <label>Designation (Hindi)</label>
          <input value={form.designation_hi} onChange={function (e) { setField('designation_hi', e.target.value); }} />
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
        <div className="form-group">
          <label>Profile text (English)</label>
          <textarea value={form.profile_text} onChange={function (e) { setField('profile_text', e.target.value); }} />
        </div>
        <div className="form-group">
          <label>Profile text (Hindi)</label>
          <textarea value={form.profile_text_hi} onChange={function (e) { setField('profile_text_hi', e.target.value); }} />
        </div>
        <div className="form-group">
          <label>Photo</label>
          <input type="file" accept="image/*" onChange={function (e) { setPhoto(e.target.files[0]); }} />
          {oldPhoto ? <div className="hint">Current file: {oldPhoto}</div> : null}
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

export default ProfessorForm;
