import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

function QuickLinks() {
  const [list, setList] = useState([]);

  async function load() {
    const res = await api('/quick-links');
    if (res.success) setList(res.data);
  }

  useEffect(function () { load(); }, []);

  async function remove(id) {
    if (!window.confirm('Delete this item?')) return;
    const res = await api('/quick-links/' + id, { method: 'DELETE' });
    if (res.success) load();
  }

  return (
    <div>
      <div className="page-head">
        <h2>Quick Links</h2>
        <Link className="btn btn-primary" to="/quick-links/new">Add Link</Link>
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
                <th>URL</th>
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
                    <td>{row.url}</td>
                    <td>{row.sort_order}</td>
                    <td>
                      <Link className="btn btn-edit" to={'/quick-links/' + row.id}>Edit</Link>
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

export default QuickLinks;
