import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

function Stats() {
  const [list, setList] = useState([]);

  async function load() {
    const res = await api('/stats');
    if (res.success) setList(res.data);
  }

  useEffect(function () { load(); }, []);

  async function remove(id) {
    if (!window.confirm('Delete this item?')) return;
    const res = await api('/stats/' + id, { method: 'DELETE' });
    if (res.success) load();
  }

  return (
    <div>
      <div className="page-head">
        <h2>Stats</h2>
        <Link className="btn btn-primary" to="/stats/new">Add Stat</Link>
      </div>
      <div className="card">
        {list.length === 0 ? (
          <div className="empty">No records found</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Label</th>
                <th>Value</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(function (row) {
                return (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.label}</td>
                    <td>{row.value}</td>
                    <td>{row.sort_order}</td>
                    <td>
                      <Link className="btn btn-edit" to={'/stats/' + row.id}>Edit</Link>
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

export default Stats;
