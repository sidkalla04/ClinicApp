import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaChartBar, FaUsers, FaUserPlus, FaSignOutAlt, FaUserMd } from 'react-icons/fa';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>SFCC Clinic</h2>
        <p>Physiotherapy & Fitness Centre</p>
      </div>

      <nav className="sidebar-nav">
        {/* <NavLink 
          to="/" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          end
        >
          <FaChartBar />
          <span>Dashboard</span>
        </NavLink> */}

        <NavLink
          to="/patients"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <FaUsers />
          <span>Patients List</span>
        </NavLink>

        <NavLink
          to="/patients/new"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <FaUserPlus />
          <span>Add Patient</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div className="user-info">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role === 'admin' ? 'Administrator' : 'Staff'}</div>
            </div>
          </div>
        )}
        <button className="logout-btn" onClick={logout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
