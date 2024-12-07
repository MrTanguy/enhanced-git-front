import { useState } from 'react';
import { useAuth } from '../hooks/AuthProvider';
import '../styles/connections.css';

const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      login(email, password)
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
                  className='inputStyle'
                />
              </div>
              <div style={{ marginBottom: "2%" }}>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="Password"
                  className='inputStyle'
                />
              </div>
              {errorMessage && <p style={{ color: 'red', fontSize: '1.2vw' }}>{errorMessage}</p>}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button 
                  type="submit" 
                  className='submitButtonStyle'>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
        <div style={{ height: "100%", width: "35%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
          <img src="/svg/loginimage.svg" style={{ width: "100%", height: "100%", objectFit: "fill" }} alt='LoginSVG'/>
          <div style={{ position: "absolute", color: "#F7F1F2", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <div style={{ fontSize: "1.2vw" }}>
            New here ?
            </div>
            <a className='swapLoginButtonStyle' href='/register'>
            Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;