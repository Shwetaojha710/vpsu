import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';

function Professors() {
  const [params] = useSearchParams();
  const [sections, setSections] = useState([]);
  const [sectionId, setSectionId] = useState(params.get('section') || '');
  const [list, setList] = useState([]);

  async function loadSections() {
    const res = await api('/sections');
    if (res.status) setSections(res.data);
  }

  async function load() {
    const query = sectionId ? '/professors?section_id=' + sectionId : '/professors';
    const res = await api(query);
    if (res.status) setList(res.data);
  }

  useEffect(function () {
    loadSections();
  }, []);

  useEffect(function () {
    load();
  }, [sectionId]);

  async function remove(id) {
    if (!window.confirm('Delete this item?')) return;
    const res = await api('/professors/' + id, { method: 'DELETE' });
    if (res.status) load();
  }

  return (
    <div>
      <div className="page-head">
        <h2>Professors</h2>
        <Link className="btn btn-primary" to={'/professors/new' + (sectionId ? '?section=' + sectionId : '')}>
          Add Professor
        </Link>
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Filter by section (Faculty / Cell / ...)</label>
          <select value={sectionId} onChange={function (e) { setSectionId(e.target.value); }}>
            <option value="">All sections</option>
            {sections.map(function (s) {
              return <option key={s.id} value={s.id}>{s.name}</option>;
            })}
          </select>
        </div>
      </div>
      <div className="card">
        {list.length === 0 ? (
          <div className="empty">No records found</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Name (Hindi)</th>
                <th>Designation</th>
                <th>Section</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(function (row) {
                return (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>
                      {row.photo ? <img className="preview" src={'/uploads/' + row.photo} alt="" /> : '-'}
                    </td>
                    <td>{row.name}</td>
                    <td>{row.name_hi || '-'}</td>
                    <td>{row.designation}</td>
                    <td>{row.section_name}</td>
                    <td>
                      <Link className="btn btn-edit" to={'/professors/' + row.id}>Edit</Link>
                      <button className="btn btn-danger" onClick={function () { remove(row.id); }}>Delete</button>
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

export default Professors;
