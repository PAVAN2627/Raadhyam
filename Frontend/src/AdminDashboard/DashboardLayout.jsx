import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu, X, LogOut, User, Home,
  LayoutDashboard, Music, Users, Disc, Mic2,
  ListMusic, CreditCard, BarChart2, Settings, Bell, Search, Headphones
} from 'lucide-react';

const NAV = [
  { name: 'Dashboard',     icon: LayoutDashboard, id: 'dashboard' },
  { name: 'Songs',         icon: Music,           id: 'songs' },
  { name: 'Albums',        icon: Disc,            id: 'albums' },
  { name: 'Artists',       icon: Mic2,            id: 'artists' },
  { name: 'Playlists',     icon: ListMusic,       id: 'playlists' },
  { name: 'Users',         icon: Users,           id: 'students' },
  { name: 'Subscriptions', icon: CreditCard,      id: 'subscriptions' },
  { name: 'Analytics',     icon: BarChart2,       id: 'analytics' },
  { name: 'Settings',      icon: Settings,        id: 'settings' },
];

const Y = '#FFC107';
const YL = '#FFF8E1';

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/'); };
  const handleGoHome = () => navigate('/');

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Headphones size={20} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', lineHeight: 1.2 }}>Raadhyam</div>
          <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Admin Portal</div>
        </div>
        <button onClick={() => setSidebarOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', display: sidebarOpen ? 'flex' : 'none', padding: 4 }}>
          <X size={18} color="#9CA3AF" />
        </button>
      </div>

      {/* Back to Home */}
      <div style={{ padding: '0.75rem' }}>
        <button onClick={handleGoHome} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, color: '#6B7280', fontFamily: 'inherit' }}
          onMouseEnter={e => { e.currentTarget.style.background = YL; e.currentTarget.style.color = '#92400E'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}>
          <Home size={16} /> Back to Home
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0 0.75rem' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.5rem 0.5rem 0.25rem', marginBottom: 2 }}>Menu</p>
        {NAV.slice(0, 6).map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: active ? 600 : 500, background: active ? Y : 'transparent', color: active ? '#fff' : '#6B7280', marginBottom: 2, textAlign: 'left' }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = YL; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
              <Icon size={17} /> {item.name}
            </button>
          );
        })}
        <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '1rem 0.5rem 0.25rem', marginBottom: 2 }}>System</p>
        {NAV.slice(6).map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: active ? 600 : 500, background: active ? Y : 'transparent', color: active ? '#fff' : '#6B7280', marginBottom: 2, textAlign: 'left' }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = YL; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
              <Icon size={17} /> {item.name}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '1rem', borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <User size={16} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin User</div>
          <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Super Admin</div>
        </div>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4, borderRadius: 6 }}
          onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
          onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
          <LogOut size={15} />
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9FAFB', fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }} />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, height: '100vh', width: 220,
        background: '#fff', borderRight: '1px solid #E5E7EB',
        zIndex: 50, display: 'flex', flexDirection: 'column',
      }} className="admin-sidebar">
        <SidebarContent />
      </aside>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 220, display: 'flex', flexDirection: 'column', minWidth: 0 }} className="admin-main">
        {/* Topbar */}
        <header style={{ height: 60, background: '#fff', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: 12, position: 'sticky', top: 0, zIndex: 30 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4, display: 'none' }} className="admin-menu-btn">
            <Menu size={22} />
          </button>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: 400, position: 'relative', marginLeft: 'auto' }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input placeholder="Search songs, artists, users..." style={{ width: '100%', padding: '7px 12px 7px 32px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: '0.85rem', color: '#111827', background: '#F9FAFB', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={e => { e.target.style.borderColor = Y; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }} />
          </div>

          {/* Notification */}
          <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8, color: '#6B7280' }}
            onMouseEnter={e => e.currentTarget.style.background = YL}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <Bell size={20} />
            <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#EF4444', border: '2px solid #fff' }} />
          </button>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderRadius: 8, cursor: 'pointer', border: '1px solid #E5E7EB' }}
            onMouseEnter={e => e.currentTarget.style.background = YL}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={14} color="#fff" />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111827' }}>Admin</span>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @media(max-width:768px){
          .admin-sidebar{ transform: ${sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'}; transition: transform .25s ease; }
          .admin-main{ margin-left: 0 !important; }
          .admin-menu-btn{ display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
