import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signUpUser, loginUser } from '../services/authService';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isSignUp) {
        // Sign up mode - create new user
        const newUser = await signUpUser({ name, email, password });
        login(newUser);
        navigate('/dashboard');
      } else {
        // Login mode - authenticate user
        const user = await loginUser(email, password);
        login(user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setIsSignUp(!isSignUp);
    // Clear form fields and error when switching modes
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    margin: 0,
    overflow: 'auto'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '450px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'slideIn 0.5s ease-out'
  };

  const headingStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '10px',
    textAlign: 'center'
  };

  const subtitleStyle = {
    color: '#718096',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '1rem'
  };

  const inputGroupStyle = {
    marginBottom: '25px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: '#4a5568',
    fontWeight: '600',
    fontSize: '0.95rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backgroundColor: '#fff',
    color: '#2d3748',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '10px',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
  };

  const logoStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '3rem'
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .login-input:focus {
            outline: none;
            border-color: #667eea !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
          }
          
          .login-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important;
          }
          
          .login-button:active {
            transform: translateY(0);
          }
        `}
      </style>
      <div style={cardStyle}>
        <div style={logoStyle}>🏥</div>
        <h1 id="login-heading" style={headingStyle}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
        <p style={subtitleStyle}>{isSignUp ? 'Sign up to access your healthcare portal' : 'Log in to access your healthcare portal'}</p>
        
        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fee',
            color: '#c33',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} aria-labelledby="login-heading">
          {isSignUp && (
            <div style={inputGroupStyle}>
              <label 
                htmlFor="name-input"
                style={labelStyle}
              >
                Full Name
              </label>
              <input
                className="login-input"
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-required="true"
                aria-label="Full name"
                placeholder="Enter your full name"
                style={inputStyle}
              />
            </div>
          )}
          <div style={inputGroupStyle}>
            <label 
              htmlFor="email-input"
              style={labelStyle}
            >
              Email Address
            </label>
            <input
              className="login-input"
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
              aria-label="Email address"
              placeholder="Enter your email"
              style={inputStyle}
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label 
              htmlFor="password-input"
              style={labelStyle}
            >
              Password
            </label>
            <input
              className="login-input"
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required="true"
              aria-label="Password"
              placeholder="Enter your password"
              style={inputStyle}
            />
          </div>
          
          <button 
            className="login-button"
            type="submit" 
            style={{...buttonStyle, opacity: loading ? 0.7 : 1}}
            aria-label="Login to your account"
            disabled={loading}
          >
            {loading ? (isSignUp ? 'Signing Up...' : 'Logging In...') : (isSignUp ? 'Sign Up' : 'Login')}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '25px', color: '#718096', fontSize: '0.9rem' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span 
            onClick={handleModeSwitch} 
            style={{ color: '#667eea', fontWeight: '600', cursor: 'pointer' }}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
