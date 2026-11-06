import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

function Galleries() {
  const [list, setList] = useState([]);

  async function load() {
    const res = await api('/galleries');
    if (res.status) setList(res.data);
  }

  useEffect(function () { load(); }, []);

  async function remove(id) {
    if (!window.confirm('Delete this item?')) return;
    const res = await api('/galleries/' + id, { method: 'DELETE' });
    if (res.status) load();
  }

  return (
    <div>
      <div className="page-head">
        <h2>Gallery</h2>
        <Link className="btn btn-primary" to="/galleries/new">Add Photo</Link>
      </div>
      <div className="card">
        {list.length === 0 ? (
          <div className="empty">No records found</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Title</th>
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
                      {row.image ? <img className="preview" src={'/uploads/' + row.image} alt="" /> : '-'}
                    </td>
                    <td>{row.title}</td>
                    <td>{String(row.created_at).slice(0, 10)}</td>
                    <td>
                      <Link className="btn btn-edit" to={'/galleries/' + row.id}>Edit</Link>
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

export default Galleries;
