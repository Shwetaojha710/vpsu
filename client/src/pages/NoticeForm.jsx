import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

function NoticeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [isPinned, setIsPinned] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [pdf, setPdf] = useState(null);
  const [oldPdf, setOldPdf] = useState('');

  useEffect(function () {
    if (!isEdit) return;
    async function load() {
      const res = await api('/notices/' + id);
      if (res.success) {
        setTitle(res.data.title || '');
        setTitleHi(res.data.title_hi || '');
        setDescription(res.data.description || '');
        setCategory(res.data.category || 'general');
        setIsPinned(res.data.is_pinned);
        setIsPublished(res.data.is_published);
        setOldPdf(res.data.pdf_file || '');
      }
    }
    load();
  }, [id, isEdit]);

  async function save(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('title_hi', titleHi);
    fd.append('description', description);
    fd.append('category', category);
    fd.append('is_pinned', isPinned ? 'true' : 'false');
    fd.append('is_published', isPublished ? 'true' : 'false');
    if (pdf) fd.append('pdf_file', pdf);

    const res = await api(isEdit ? '/notices/' + id : '/notices', {
      method: isEdit ? 'PUT' : 'POST',
      body: fd
    });

    if (res.success) {
      alert('Saved');
      navigate('/notices');
    } else {
      alert(res.message);
    }
  }

  return (
    <div>
      <div className="page-head">
        <h2>{isEdit ? 'Edit Notice' : 'Add Notice'}</h2>
      </div>
      <form className="card form" onSubmit={save}>
        <div className="form-group">
          <label>Title</label>
          <input value={title} onChange={function (e) { setTitle(e.target.value); }} required />
        </div>
        <div className="form-group">
          <label>Title (Hindi)</label>
          <input value={titleHi} onChange={function (e) { setTitleHi(e.target.value); }} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={function (e) { setDescription(e.target.value); }} />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={function (e) { setCategory(e.target.value); }}>
            <option value="exam">exam</option>
            <option value="admission">admission</option>
            <option value="recruitment">recruitment</option>
            <option value="tender">tender</option>
            <option value="general">general</option>
          </select>
        </div>
        <div className="form-group">
          <label>PDF file</label>
          <input type="file" accept=".pdf" onChange={function (e) { setPdf(e.target.files[0]); }} />
          {oldPdf ? <div className="hint">Current file: {oldPdf}</div> : null}
        </div>
        <label className="check">
          <input type="checkbox" checked={isPinned} onChange={function (e) { setIsPinned(e.target.checked); }} />
          Pin this notice
        </label>
        <label className="check">
          <input type="checkbox" checked={isPublished} onChange={function (e) { setIsPublished(e.target.checked); }} />
          Published
        </label>
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
}

export default NoticeForm;
