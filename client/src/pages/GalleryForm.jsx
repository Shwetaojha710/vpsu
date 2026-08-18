import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

function GalleryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [oldImage, setOldImage] = useState('');

  useEffect(function () {
    if (!isEdit) return;
    async function load() {
      const res = await api('/galleries/' + id);
      if (res.success) {
        setTitle(res.data.title || '');
        setOldImage(res.data.image || '');
      }
    }
    load();
  }, [id, isEdit]);

  async function save(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    if (file) fd.append('image', file);

    const res = await api(isEdit ? '/galleries/' + id : '/galleries', {
      method: isEdit ? 'PUT' : 'POST',
      body: fd
    });
    if (res.success) {
      alert('Saved');
      navigate('/galleries');
    } else {
      alert(res.message);
    }
  }

  return (
    <div>
      <div className="page-head">
        <h2>{isEdit ? 'Edit Photo' : 'Add Photo'}</h2>
      </div>
      <form className="card form" onSubmit={save}>
        <div className="form-group">
          <label>Title</label>
          <input value={title} onChange={function (e) { setTitle(e.target.value); }} required />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input type="file" accept="image/*" onChange={function (e) { setFile(e.target.files[0]); }} />
          {oldImage ? <div className="hint">Current file: {oldImage}</div> : null}
        </div>
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
}

export default GalleryForm;
