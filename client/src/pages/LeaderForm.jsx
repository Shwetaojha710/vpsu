import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

function LeaderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [profileText, setProfileText] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [file, setFile] = useState(null);
  const [oldPhoto, setOldPhoto] = useState('');

  useEffect(function () {
    if (!isEdit) return;
    async function load() {
      const res = await api('/leaders/' + id);
      if (res.status) {
        setName(res.data.name || '');
        setDesignation(res.data.designation || '');
        setProfileText(res.data.profile_text || '');
        setSortOrder(res.data.sort_order || 0);
        setOldPhoto(res.data.photo || '');
      }
    }
    load();
  }, [id, isEdit]);

  async function save(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', name);
    fd.append('designation', designation);
    fd.append('profile_text', profileText);
    fd.append('sort_order', sortOrder);
    if (file) fd.append('photo', file);

    const res = await api(isEdit ? '/leaders/' + id : '/leaders', {
      method: isEdit ? 'PUT' : 'POST',
      body: fd
    });
    if (res.status) {
      alert('Saved');
      navigate('/leaders');
    } else {
      alert(res.message);
    }
  }

  return (
    <div>
      <div className="page-head">
        <h2>{isEdit ? 'Edit Leader' : 'Add Leader'}</h2>
      </div>
      <form className="card form" onSubmit={save}>
        <div className="form-group">
          <label>Name</label>
          <input value={name} onChange={function (e) { setName(e.target.value); }} required />
        </div>
        <div className="form-group">
          <label>Designation</label>
          <input value={designation} onChange={function (e) { setDesignation(e.target.value); }} />
        </div>
        <div className="form-group">
          <label>Profile text</label>
          <textarea value={profileText} onChange={function (e) { setProfileText(e.target.value); }} />
        </div>
        <div className="form-group">
          <label>Sort order</label>
          <input type="number" value={sortOrder} onChange={function (e) { setSortOrder(e.target.value); }} />
        </div>
        <div className="form-group">
          <label>Photo</label>
          <input type="file" accept="image/*" onChange={function (e) { setFile(e.target.files[0]); }} />
          {oldPhoto ? <div className="hint">Current file: {oldPhoto}</div> : null}
        </div>
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
}

export default LeaderForm;
