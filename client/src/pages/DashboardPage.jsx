import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStatsApi } from '../api/axios';
import Header from '../components/Layout/Header';
import { FaUsers, FaCalendarCheck, FaUserPlus, FaChevronRight, FaFileMedical } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStatsApi()
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span>Loading stats...</span>
      </div>
    );
  }

  return (
    <>
      <Header title="Dashboard" subtitle="Welcome to SFCC Physiotherapy Clinic System" />
      
      <div className="page-body">
        {/* Statistics Cards */}
        <div className="grid-stats">
          <div className="stat-card">
            <div className="stat-icon teal">
              <FaUsers />
            </div>
            <div>
              <div className="stat-label">Total Patients</div>
              <div className="stat-value">{stats?.totalPatients || 0}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon green">
              <FaCalendarCheck />
            </div>
            <div>
              <div className="stat-label">Sessions Logged Today</div>
              <div className="stat-value">{stats?.todaySessions || 0}</div>
            </div>
          </div>
        </div>

        <div className="form-grid-2">
          {/* Quick Actions Panel */}
          <div className="card">
            <div className="card-header">
              <h3>Quick Administration Actions</h3>
            </div>
            <div className="card-body flex flex-col gap-3">
              <Link to="/patients/new" className="btn btn-primary btn-lg" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                <FaUserPlus />
                <span>Create New Patient Record</span>
              </Link>
              
              <Link to="/patients" className="btn btn-secondary btn-lg" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                <FaUsers />
                <span>Search / Manage Existing Patients</span>
              </Link>
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="card">
            <div className="card-header">
              <h3>Recently Registered Patients</h3>
              <Link to="/patients" style={{ fontSize: '12px', color: 'var(--teal)', fontWeight: '600', textDecoration: 'none' }}>
                View All
              </Link>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {stats?.recentPatients?.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-400)' }}>
                  No patients registered yet.
                </div>
              ) : (
                <div className="table-wrap" style={{ border: 'none', borderRadius: 0 }}>
                  <table>
                    <tbody>
                      {stats?.recentPatients.map((patient) => (
                        <tr key={patient._id}>
                          <td>
                            <div style={{ fontWeight: '600', color: 'var(--gray-900)' }}>{patient.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--gray-500)' }}>Case: {patient.caseNo || 'N/A'}</div>
                          </td>
                          <td style={{ color: 'var(--gray-500)', fontSize: '12px' }}>
                            {patient.createdAt ? `${formatDistanceToNow(new Date(patient.createdAt))} ago` : ''}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <Link to={`/patients/${patient._id}`} className="btn btn-secondary btn-sm btn-ghost">
                              <FaChevronRight />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
