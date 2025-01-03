import { useState } from 'react';
import { UseAuth } from '../hooks/AuthProvider';
import { useNavigate } from 'react-router-dom';
import '../styles/connections.css';

const LoginForm = () => {
  const { login } = UseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await login(email, password)
      navigate("/dashboard")
    } catch (err) {
      setErrorMessage(err.message)
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}>
      <div style={{ width: "60%", height: "70%", backgroundColor: "#F7F1F2", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={{ height: "100%", width: "65%", border: "5px solid #739BF2", borderRight: 0, boxSizing: "border-box", display: "flex", justifyContent: "center"}}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", width: "50%" }}>
            <div style={{ fontSize: "2vw", marginBottom: "20px", color: "#4A81F8" }}>Login</div>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <div style={{ marginBottom: "2%" }}>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="Email"
                  className='input'
                />
              </div>
              <div style={{ marginBottom: "2%" }}>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="Password"
                  className='input'
                />
              </div>
              {errorMessage && <p style={{ color: 'red', fontSize: '1.2vw' }}>{errorMessage}</p>}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button 
                  type="submit" 
                  className='submitButton'>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
        <div style={{ height: "100%", width: "35%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
          <img src="/loginimage.svg" style={{ width: "100%", height: "100%", objectFit: "fill" }} alt='LoginSVG'/>
          <div style={{ position: "absolute", color: "#F7F1F2", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <div style={{ fontSize: "1.2vw" }}>
            New here ?
            </div>
            <a className='swapLoginButton' onClick={() => navigate("/register") }>
            Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;