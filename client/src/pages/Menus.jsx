import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';

function Menus() {
  const { parentId } = useParams();
  const [list, setList] = useState([]);
  const [parent, setParent] = useState(null);

  async function load() {
    // load only this level: top menus, or children of one menu
    const query = parentId ? '/menus/list?parent_id=' + parentId : '/menus/list';
    const res = await api(query);
    if (res.status) setList(res.data);

    if (parentId) {
      const one = await api('/menus/' + parentId);
      if (one.status) setParent(one.data);
    } else {
      setParent(null);
    }
  }

  useEffect(function () {
    load();
  }, [parentId]);

  async function remove(id) {
    if (!window.confirm('Delete this menu and all menus inside it?')) return;
    const res = await api('/menus/' + id, { method: 'DELETE' });
    if (res.status) load();
  }

  const backUrl = parent && parent.parent_id
    ? '/menus/' + parent.parent_id + '/children'
    : '/menus';

  return (
    <div>
      <div className="page-head">
        <h2>{parent ? parent.title + ' - Sub Menus' : 'Menus'}</h2>
        <div>
          {parent ? <Link className="btn btn-light" to={backUrl}>Back</Link> : null}
          {' '}
          <Link className="btn btn-primary" to={parentId ? '/menus/' + parentId + '/children/new' : '/menus/new'}>
            {parentId ? 'Add Sub Menu' : 'Add Menu'}
          </Link>
        </div>
      </div>

      {parent && parent.path ? (
        <div className="crumb">
          <Link to="/menus">Menus</Link>
          {parent.path.map(function (item) {
            return (
              <span key={item.id}>
                {' / '}
                <Link to={'/menus/' + item.id + '/children'}>{item.title}</Link>
              </span>
            );
          })}
        </div>
      ) : null}

      <div className="card">
        {list.length === 0 ? (
          <div className="empty">No records found. You can add more sub menus here.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>URL</th>
                <th>Inside</th>
                <th>Order</th>
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
                      {row.is_active ? null : <span className="badge"> Hidden</span>}
                    </td>
                    <td>{row.url}</td>
                    <td>{row.child_count}</td>
                    <td>{row.sort_order}</td>
                    <td>
                      <Link className="btn btn-edit" to={'/menus/' + row.id + '/children'}>
                        Sub Menus
                      </Link>
                      <Link className="btn btn-edit" to={'/menus/' + row.id + '/edit'}>Edit</Link>
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

export default Menus;
