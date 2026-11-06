import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';

function SideMenus() {
  const [params] = useSearchParams();
  const [sections, setSections] = useState([]);
  const [sectionId, setSectionId] = useState(params.get('section') || '');
  const [list, setList] = useState([]);

  async function loadSections() {
    const res = await api('/sections');
    if (res.status) setSections(res.data);
  }

  async function load() {
    const query = sectionId ? '/side-menus?section_id=' + sectionId : '/side-menus';
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
    const res = await api('/side-menus/' + id, { method: 'DELETE' });
    if (res.status) load();
  }

  return (
    <div>
      <div className="page-head">
        <h2>Side Menus</h2>
        <Link className="btn btn-primary" to={'/side-menus/new' + (sectionId ? '?section=' + sectionId : '')}>
          Add Side Menu
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
                <th>Title</th>
                <th>Title (Hindi)</th>
                <th>Type</th>
                <th>Section</th>
                <th>Slug</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(function (row) {
                return (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.title}</td>
                    <td>{row.title_hi || '-'}</td>
                    <td>{row.page_type || 'static'}</td>
                    <td>{row.section_name}</td>
                    <td>{row.slug}</td>
                    <td>{row.sort_order}</td>
                    <td>
                      <Link className="btn btn-edit" to={'/side-menus/' + row.id}>Edit</Link>
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

export default SideMenus;
