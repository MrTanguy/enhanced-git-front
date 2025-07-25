import { useState } from 'react';
import { UseAuth } from '../hooks/AuthProvider';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const LoginForm = () => {
  const { login } = UseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-left">
          <div className="login-form-wrapper">
            <div className="login-title">Login</div>
            <form onSubmit={handleSubmit} aria-label="Login form">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email"
                  className="input"
                  aria-label="Email address"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="input"
                  aria-label="Password"
                />
              </div>
              {errorMessage && (
                <p style={{ color: 'red', fontSize: '1.2vw' }}>{errorMessage}</p>
              )}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="submit"
                  className="submit-button"
                  aria-label="Submit login form"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="login-right">
          <img
            src="/loginimage.svg"
            className="login-image"
            alt="Illustration de connexion"
          />
          <div className="register-overlay">
            <div className="register-overlay-text">New here ?</div>
            <a
              className="swap-login-button"
              onClick={() => navigate("/register")}
              aria-label="Register link"
            >
              Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
