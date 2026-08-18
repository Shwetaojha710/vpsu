import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

function SliderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [file, setFile] = useState(null);
  const [oldImage, setOldImage] = useState('');

  useEffect(function () {
    if (!isEdit) return;
    async function load() {
      const res = await api('/slider/' + id);
      if (res.success) {
        setTitle(res.data.title || '');
        setLink(res.data.link || '');
        setSortOrder(res.data.sort_order || 0);
        setIsActive(res.data.is_active);
        setOldImage(res.data.image || '');
      }
    }
    load();
  }, [id, isEdit]);

  async function save(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('link', link);
    fd.append('sort_order', sortOrder);
    fd.append('is_active', isActive ? 'true' : 'false');
    if (file) fd.append('image', file);

    const res = await api(isEdit ? '/slider/' + id : '/slider', {
      method: isEdit ? 'PUT' : 'POST',
      body: fd
    });
    if (res.success) {
      alert('Saved');
      navigate('/slider');
    } else {
      alert(res.message);
    }
  }

  return (
    <div>
      <div className="page-head">
        <h2>{isEdit ? 'Edit Slide' : 'Add Slide'}</h2>
      </div>
      <form className="card form" onSubmit={save}>
        <div className="form-group">
          <label>Title</label>
          <input value={title} onChange={function (e) { setTitle(e.target.value); }} required />
        </div>
        <div className="form-group">
          <label>Link</label>
          <input value={link} onChange={function (e) { setLink(e.target.value); }} />
        </div>
        <div className="form-group">
          <label>Sort order</label>
          <input type="number" value={sortOrder} onChange={function (e) { setSortOrder(e.target.value); }} />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input type="file" accept="image/*" onChange={function (e) { setFile(e.target.files[0]); }} />
          {oldImage ? <div className="hint">Current file: {oldImage}</div> : null}
        </div>
        <label className="check">
          <input type="checkbox" checked={isActive} onChange={function (e) { setIsActive(e.target.checked); }} />
          Active
        </label>
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
}

export default SliderForm;
