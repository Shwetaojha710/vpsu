import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

function Notices() {
  const [list, setList] = useState([]);

  async function load() {
    // this function loads all notices from backend
    const res = await api('/notices');
    if (res.success) setList(res.data);
  }

  useEffect(function () {
    load();
  }, []);

  async function remove(id) {
    if (!window.confirm('Delete this item?')) return;
    const res = await api('/notices/' + id, { method: 'DELETE' });
    if (res.success) load();
  }

  return (
    <div>
      <div className="page-head">
        <h2>Notices</h2>
        <Link className="btn btn-primary" to="/notices/new">Add Notice</Link>
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
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(function (row) {
                return (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>
                      {row.title}
                      {row.is_pinned ? <span className="badge"> Pin</span> : null}
                    </td>
                    <td>{row.category}</td>
                    <td>{String(row.created_at).slice(0, 10)}</td>
                    <td>
                      <Link className="btn btn-edit" to={'/notices/' + row.id}>Edit</Link>
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

export default Notices;
