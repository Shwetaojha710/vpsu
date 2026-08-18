import { useEffect, useState } from 'react';
import { api } from '../api';

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(function () {
    // this function loads counts from backend
    async function load() {
      const res = await api('/dashboard');
      if (res.success) setData(res.data);
    }
    load();
  }, []);

  if (!data) {
    return <div className="card">Loading...</div>;
  }

  return (
    <div>
      <div className="page-head">
        <h2>Dashboard</h2>
      </div>
      <div className="cards">
        <div className="stat-card">
          <h3>Total Notices</h3>
          <p>{data.notices}</p>
        </div>
        <div className="stat-card">
          <h3>Published Notices</h3>
          <p>{data.publishedNotices}</p>
        </div>
        <div className="stat-card">
          <h3>Pages</h3>
          <p>{data.pages}</p>
        </div>
        <div className="stat-card">
          <h3>Colleges</h3>
          <p>{data.colleges}</p>
        </div>
        <div className="stat-card">
          <h3>Gallery Photos</h3>
          <p>{data.galleries}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
