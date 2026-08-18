import { NavLink, useNavigate } from 'react-router-dom';
import { getAdmin, logout } from './auth';

const menus = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/notices', label: 'Notices' },
  { to: '/pages', label: 'Pages' },
  { to: '/slider', label: 'Slider' },
  { to: '/leaders', label: 'Leaders' },
  { to: '/stats', label: 'Stats' },
  { to: '/quick-links', label: 'Quick Links' },
  { to: '/galleries', label: 'Gallery' },
  { to: '/colleges', label: 'Colleges' },
  { to: '/change-password', label: 'Change Password' }
];

function Layout({ children }) {
  const navigate = useNavigate();
  const admin = getAdmin();

  function onLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">VPSU</div>
          <div className="brand-name">Purvanchal University</div>
          <div className="brand-sub">Jaunpur Admin</div>
        </div>
        <nav>
          {menus.map(function (item) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={function (link) {
                  return link.isActive ? 'menu-link active' : 'menu-link';
                }}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="main">
        <header className="topbar">
          <h1>VPSU Admin</h1>
          <div className="topbar-right">
            <span>{admin ? admin.name : 'Admin'}</span>
            <button className="btn btn-light" onClick={onLogout}>Logout</button>
          </div>
        </header>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
