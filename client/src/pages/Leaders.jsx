import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

function Leaders() {
  const [list, setList] = useState([]);

  async function load() {
    const res = await api('/leaders');
    if (res.status) setList(res.data);
  }

  useEffect(function () { load(); }, []);

  async function remove(id) {
    if (!window.confirm('Delete this item?')) return;
    const res = await api('/leaders/' + id, { method: 'DELETE' });
    if (res.status) load();
  }

  return (
    <div>
      <div className="page-head">
        <h2>Leaders</h2>
        <Link className="btn btn-primary" to="/leaders/new">Add Leader</Link>
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
                <th>Designation</th>
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
                    <td>{row.designation}</td>
                    <td>
                      <Link className="btn btn-edit" to={'/leaders/' + row.id}>Edit</Link>
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

export default Leaders;
