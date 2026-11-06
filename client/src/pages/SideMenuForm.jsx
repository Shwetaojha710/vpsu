import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import Editor from '../Editor.jsx';

function SideMenuForm() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [sections, setSections] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileTitle, setFileTitle] = useState('');
  const [fileTitleHi, setFileTitleHi] = useState('');
  const [fileLang, setFileLang] = useState('English');
  const [fileObj, setFileObj] = useState(null);
  const [form, setForm] = useState({
    section_id: params.get('section') || '',
    title: '',
    title_hi: '',
    slug: '',
    page_type: 'static',
    content: '',
    content_hi: '',
    sort_order: 0,
    is_active: true
  });

  function setField(name, value) {
    setForm(function (old) {
      return Object.assign({}, old, { [name]: value });
    });
  }

  async function loadFiles() {
    if (!id) return;
    const res = await api('/side-menu-files?side_menu_id=' + id);
    if (res.status) setFiles(res.data);
  }

  useEffect(function () {
    async function load() {
      const sec = await api('/sections');
      if (sec.success) setSections(sec.data);

      if (!isEdit) return;
      const res = await api('/side-menus/' + id);
      if (res.status) {
        setForm({
          section_id: String(res.data.section_id || ''),
          title: res.data.title || '',
          title_hi: res.data.title_hi || '',
          slug: res.data.slug || '',
          page_type: res.data.page_type || 'static',
          content: res.data.content || '',
          content_hi: res.data.content_hi || '',
          sort_order: res.data.sort_order || 0,
          is_active: res.data.is_active
        });
      }
      loadFiles();
    }
    load();
  }, [id, isEdit]);

  async function save(e) {
    e.preventDefault();
    const res = await api(isEdit ? '/side-menus/' + id : '/side-menus', {
      method: isEdit ? 'PUT' : 'POST',
      body: {
        section_id: Number(form.section_id),
        title: form.title,
        title_hi: form.title_hi,
        page_type: form.page_type,
        content: form.content,
        content_hi: form.content_hi,
        sort_order: Number(form.sort_order),
        is_active: form.is_active
      }
    });
    if (res.status) {
      alert('Saved');
      if (isEdit) {
        setForm(function (old) {
          return Object.assign({}, old, { slug: res.data.slug });
        });
      } else {
        navigate('/side-menus/' + res.data.id);
      }
    } else {
      alert(res.message);
    }
  }

  async function addFile(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('side_menu_id', id);
    fd.append('title', fileTitle);
    fd.append('title_hi', fileTitleHi);
    fd.append('language', fileLang);
    if (fileObj) fd.append('file', fileObj);
    const res = await api('/side-menu-files', { method: 'POST', body: fd });
    if (res.status) {
      setFileTitle('');
      setFileTitleHi('');
      setFileObj(null);
      loadFiles();
    } else {
      alert(res.message);
    }
  }

  async function removeFile(fileId) {
    if (!window.confirm('Delete this item?')) return;
    const res = await api('/side-menu-files/' + fileId, { method: 'DELETE' });
    if (res.status) loadFiles();
  }

  return (
    <div>
      <div className="page-head">
        <h2>{isEdit ? 'Edit Side Menu' : 'Add Side Menu'}</h2>
      </div>
      <form className="card form form-wide" onSubmit={save}>
        <div className="form-group">
          <label>Select section (Faculty / Department / Cell)</label>
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
          <label>Title (example: Introduction, Fee Structure)</label>
          <input value={form.title} onChange={function (e) { setField('title', e.target.value); }} required />
        </div>
        <div className="form-group">
          <label>Title (Hindi)</label>
          <input value={form.title_hi} onChange={function (e) { setField('title_hi', e.target.value); }} />
        </div>
        <div className="form-group">
          <label>Page type</label>
          <select value={form.page_type} onChange={function (e) { setField('page_type', e.target.value); }}>
            <option value="static">static - CKEditor text (Introduction)</option>
            <option value="dynamic">dynamic - professors list (Faculty)</option>
            <option value="table">table - text + PDF files (Fee, Notices, Ordinances)</option>
            <option value="custom">custom - department photo gallery</option>
          </select>
        </div>
        {form.slug ? <div className="hint">URL slug (auto): {form.slug}</div> : (
          <div className="hint">Slug will be created automatically from title + department name.</div>
        )}
        {form.page_type === 'static' || form.page_type === 'table' ? (
          <div>
            <div className="form-group">
              <label>Content (English)</label>
              <Editor value={form.content} onChange={function (html) { setField('content', html); }} />
            </div>
            <div className="form-group">
              <label>Content (Hindi)</label>
              <Editor value={form.content_hi} onChange={function (html) { setField('content_hi', html); }} />
            </div>
          </div>
        ) : null}
        {form.page_type === 'dynamic' ? (
          <div className="hint">This page will show Professors of the selected section.</div>
        ) : null}
        {form.page_type === 'custom' ? (
          <div className="hint">This page will show Department Photos of the selected section.</div>
        ) : null}
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

      {isEdit && form.page_type === 'table' ? (
        <div className="card form form-wide" style={{ marginTop: 16 }}>
          <h3 style={{ marginBottom: 12 }}>Files / PDFs</h3>
          <form onSubmit={addFile}>
            <div className="form-row">
              <div className="form-group">
                <label>File title (English)</label>
                <input value={fileTitle} onChange={function (e) { setFileTitle(e.target.value); }} required />
              </div>
              <div className="form-group">
                <label>File title (Hindi)</label>
                <input value={fileTitleHi} onChange={function (e) { setFileTitleHi(e.target.value); }} />
              </div>
              <div className="form-group">
                <label>Language</label>
                <select value={fileLang} onChange={function (e) { setFileLang(e.target.value); }}>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>PDF / file</label>
              <input type="file" onChange={function (e) { setFileObj(e.target.files[0]); }} />
            </div>
            <button className="btn btn-primary" type="submit">Add File</button>
          </form>
          {files.length === 0 ? (
            <div className="empty">No files yet</div>
          ) : (
            <table style={{ marginTop: 12 }}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Title (Hindi)</th>
                  <th>File</th>
                  <th>Language</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {files.map(function (row) {
                  return (
                    <tr key={row.id}>
                      <td>{row.title}</td>
                      <td>{row.title_hi || '-'}</td>
                      <td>{row.file_name}</td>
                      <td>{row.language}</td>
                      <td>
                        <button className="btn btn-danger" type="button" onClick={function () { removeFile(row.id); }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default SideMenuForm;
