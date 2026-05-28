import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../api/axios';
import { FaUserMd, FaLock, FaArrowRight } from 'react-icons/fa';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await loginApi({ email, password });
      login(res.data, res.data.token);
      toast.success(`Welcome back, ${res.data.name}!`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card animate-fade-in">
        <div className="login-logo">
          <div className="logo-icon">
            <FaUserMd />
          </div>
          <h1>SFCC Clinic</h1>
          <p>Physiotherapy & Fitness Centre</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>Authorized Access Only</h2>

          {error && (
            <div className="alert alert-error mb-4" role="alert">
              {error}
            </div>
          )}

          <div className="form-group mb-4">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@sfcc.com"
              required
            />
          </div>

          <div className="form-group mb-4">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full btn-lg mt-4"
            disabled={loading}
            style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? (
              <span className="spinner" style={{ width: '16px', height: '16px', margin: 0 }}></span>
            ) : (
              <>
                <span>Sign In</span>
                <FaArrowRight />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
