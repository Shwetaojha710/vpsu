import { Navigate, Route, Routes } from 'react-router-dom';
import { getToken } from './auth';
import Layout from './Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Notices from './pages/Notices.jsx';
import NoticeForm from './pages/NoticeForm.jsx';
import Pages from './pages/Pages.jsx';
import PageForm from './pages/PageForm.jsx';
import Slider from './pages/Slider.jsx';
import SliderForm from './pages/SliderForm.jsx';
import Leaders from './pages/Leaders.jsx';
import LeaderForm from './pages/LeaderForm.jsx';
import Stats from './pages/Stats.jsx';
import StatForm from './pages/StatForm.jsx';
import QuickLinks from './pages/QuickLinks.jsx';
import QuickLinkForm from './pages/QuickLinkForm.jsx';
import Galleries from './pages/Galleries.jsx';
import GalleryForm from './pages/GalleryForm.jsx';
import Colleges from './pages/Colleges.jsx';
import CollegeForm from './pages/CollegeForm.jsx';
import ChangePassword from './pages/ChangePassword.jsx';

// if there is no token, send user to login page
function Protected({ children }) {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <Protected>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/notices/new" element={<NoticeForm />} />
              <Route path="/notices/:id" element={<NoticeForm />} />
              <Route path="/pages" element={<Pages />} />
              <Route path="/pages/new" element={<PageForm />} />
              <Route path="/pages/:id" element={<PageForm />} />
              <Route path="/slider" element={<Slider />} />
              <Route path="/slider/new" element={<SliderForm />} />
              <Route path="/slider/:id" element={<SliderForm />} />
              <Route path="/leaders" element={<Leaders />} />
              <Route path="/leaders/new" element={<LeaderForm />} />
              <Route path="/leaders/:id" element={<LeaderForm />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/stats/new" element={<StatForm />} />
              <Route path="/stats/:id" element={<StatForm />} />
              <Route path="/quick-links" element={<QuickLinks />} />
              <Route path="/quick-links/new" element={<QuickLinkForm />} />
              <Route path="/quick-links/:id" element={<QuickLinkForm />} />
              <Route path="/galleries" element={<Galleries />} />
              <Route path="/galleries/new" element={<GalleryForm />} />
              <Route path="/galleries/:id" element={<GalleryForm />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/colleges/new" element={<CollegeForm />} />
              <Route path="/colleges/:id" element={<CollegeForm />} />
              <Route path="/change-password" element={<ChangePassword />} />
            </Routes>
          </Protected>
        }
      />
    </Routes>
  );
}

export default App;
