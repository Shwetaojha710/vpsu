import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

function Pages() {
  const [list, setList] = useState([]);

  async function load() {
    const res = await api('/pages');
    if (res.success) setList(res.data);
  }

  useEffect(function () { load(); }, []);

  async function remove(id) {
    if (!window.confirm('Delete this item?')) return;
    const res = await api('/pages/' + id, { method: 'DELETE' });
    if (res.success) load();
  }

  return (
    <div>
      <div className="page-head">
        <h2>Pages</h2>
        <Link className="btn btn-primary" to="/pages/new">Add Page</Link>
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
                <th>Slug</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(function (row) {
                return (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.title}</td>
                    <td>{row.slug}</td>
                    <td>{String(row.updated_at).slice(0, 10)}</td>
                    <td>
                      <Link className="btn btn-edit" to={'/pages/' + row.id}>Edit</Link>
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

export default Pages;
