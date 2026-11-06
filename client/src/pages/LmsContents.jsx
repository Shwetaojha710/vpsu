import { useEffect, useState } from 'react';
import { api } from '../api';

function LmsContents() {
  const [list, setList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    subject_id: '',
    teacher_id: '',
    type: 'link',
    link_url: '',
    file: null,
    is_published: false
  });

  async function load() {
    const [contents, courseRes, subjectRes, teacherRes] = await Promise.all([
      api('/lms/contents'),
      api('/lms/courses'),
      api('/lms/subjects'),
      api('/lms/teachers')
    ]);
    if (contents.status) setList(contents.data || []);
    if (courseRes.status) setCourses(courseRes.data || []);
    if (subjectRes.status) setSubjects(subjectRes.data || []);
    if (teacherRes.status) setTeachers(teacherRes.data || []);
  }

  useEffect(function () {
    load();
  }, []);

  async function save(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('subject_id', form.subject_id);
    if (form.teacher_id) fd.append('teacher_id', form.teacher_id);
    fd.append('type', form.type);
    fd.append('link_url', form.link_url);
    fd.append('is_published', form.is_published ? 'true' : 'false');
    if (form.file) fd.append('file', form.file);

    const res = await api('/lms/contents', { method: 'POST', body: fd });
    if (res.status) {
      setForm({
        title: '',
        subject_id: '',
        teacher_id: '',
        type: 'link',
        link_url: '',
        file: null,
        is_published: false
      });
      load();
      alert('Content saved');
    } else {
      alert(res.message || 'Save failed');
    }
  }

  async function togglePublish(row) {
    const res = await api('/lms/contents/' + row.id + '/publish', {
      method: 'PATCH',
      body: { is_published: !row.is_published }
    });
    if (res.status) load();
    else alert(res.message || 'Failed');
  }

  async function remove(id) {
    if (!window.confirm('Delete this content?')) return;
    const res = await api('/lms/contents/' + id, { method: 'DELETE' });
    if (res.status) load();
  }

  return (
    <div>
      <div className="page-head">
        <h2>LMS Contents</h2>
      </div>

      <form className="card form" onSubmit={save} style={{ marginBottom: 20 }}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={form.title}
            onChange={function (e) { setForm({ ...form, title: e.target.value }); }}
            required
          />
        </div>
        <div className="form-group">
          <label>Subject</label>
          <select
            value={form.subject_id}
            onChange={function (e) { setForm({ ...form, subject_id: e.target.value }); }}
            required
          >
            <option value="">Select subject</option>
            {subjects.map(function (s) {
              return (
                <option key={s.id} value={s.id}>
                  {s.name} ({courses.find(function (c) { return c.id === s.course_id; })?.name || s.course_id})
                </option>
              );
            })}
          </select>
        </div>
        <div className="form-group">
          <label>Teacher</label>
          <select
            value={form.teacher_id}
            onChange={function (e) { setForm({ ...form, teacher_id: e.target.value }); }}
          >
            <option value="">Optional</option>
            {teachers.map(function (t) {
              return <option key={t.id} value={t.id}>{t.name}</option>;
            })}
          </select>
        </div>
        <div className="form-group">
          <label>Type</label>
          <select
            value={form.type}
            onChange={function (e) { setForm({ ...form, type: e.target.value }); }}
          >
            <option value="link">link</option>
            <option value="video">video</option>
            <option value="pdf">pdf</option>
          </select>
        </div>
        {form.type === 'link' ? (
          <div className="form-group">
            <label>Link URL</label>
            <input
              value={form.link_url}
              onChange={function (e) { setForm({ ...form, link_url: e.target.value }); }}
            />
          </div>
        ) : (
          <div className="form-group">
            <label>File</label>
            <input
              type="file"
              onChange={function (e) { setForm({ ...form, file: e.target.files[0] }); }}
            />
          </div>
        )}
        <label className="check">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={function (e) { setForm({ ...form, is_published: e.target.checked }); }}
          />
          Publish now
        </label>
        <button className="btn btn-primary" type="submit">Upload</button>
      </form>

      <div className="card">
        {list.length === 0 ? (
          <div className="empty">No LMS content yet</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Subject</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(function (row) {
                return (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.title}</td>
                    <td>{row.subject?.name || row.subject_id}</td>
                    <td>{row.type}</td>
                    <td>{row.is_published ? 'Published' : 'Draft'}</td>
                    <td>
                      <button className="btn btn-edit" onClick={function () { togglePublish(row); }}>
                        {row.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button className="btn btn-danger" onClick={function () { remove(row.id); }}>
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
    </div>
  );
}

export default LmsContents;
