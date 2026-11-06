import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

function Sections() {
  const [list, setList] = useState([]);

  async function load() {
    const res = await api('/sections');
    if (res.status) setList(res.data);
  }

  useEffect(function () {
    load();
  }, []);

  async function remove(id) {
    if (!window.confirm('Delete this section and its side menus / professors?')) return;
    const res = await api('/sections/' + id, { method: 'DELETE' });
    if (res.status) load();
  }

  return (
    <div>
      <div className="page-head">
        <h2>Sections</h2>
        <Link className="btn btn-primary" to="/sections/new">Add Section</Link>
      </div>
      <p className="hint" style={{ marginBottom: 12 }}>
        Faculty, Cell, Institute — Dean and Professors will be linked to a section.
      </p>
      <div className="card">
        {list.length === 0 ? (
          <div className="empty">No records found</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Side Menus</th>
                <th>Professors</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(function (row) {
                return (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.type}</td>
                    <td>{row.side_menu_count}</td>
                    <td>{row.professor_count}</td>
                    <td>
                      <Link className="btn btn-edit" to={'/side-menus?section=' + row.id}>Side Menus</Link>
                      <Link className="btn btn-edit" to={'/professors?section=' + row.id}>Professors</Link>
                      <Link className="btn btn-edit" to={'/banners?section=' + row.id}>Banner</Link>
                      <Link className="btn btn-edit" to={'/section-photos?section=' + row.id}>Photos</Link>
                      <Link className="btn btn-edit" to={'/sections/' + row.id}>Edit</Link>
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

export default Sections;
