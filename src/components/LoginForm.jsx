import { useState } from 'react';
import '../../public/css/App.css';

function Login() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [registerIsHovered, setRegisterIsHovered] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    console.log(formData)


    fetch('https://127.0.0.1:8000/auth/token', {
      method: 'POST',
      headers: {
        'Authorization': 'application/x-www-form-urlencoded'
      },
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.detail);
        });
      }
      setErrorMessage("")
      return response.json()
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      setErrorMessage(error.message);
    })
  };

  const registerButtonStyle = {
    borderRadius: "10px", 
    backgroundColor: "#F7F1F2", 
    color: "#4A81F8", 
    padding: "5%",
    fontSize: "1.5vw",
    marginTop: "10px",
    boxShadow: registerIsHovered ? "0 4px 10px rgba(0, 0, 0, 0.5)" : "",
    cursor: "pointer",
    transition: "box-shadow 0.3s ease"
  }   

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ width: "60%", height: "70%", backgroundColor: "#F7F1F2", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={{ height: "100%", width: "65%", border: "5px solid #739BF2", borderRight: 0, boxSizing: "border-box", display: "flex", justifyContent: "center"}}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <div style={{ fontSize: "2vw", marginBottom: "20px", color: "#4A81F8" }}>Connexion</div>
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
                  className='loginButtonStyle'>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
        <div style={{ height: "100%", width: "35%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
            <img src="/svg/loginimage.svg" style={{ width: "100%", height: "100%", objectFit: "fill" }} alt='LoginSVG'/>
            <div style={{ position: "absolute", color: "#F7F1F2", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <div style={{ fontSize: "2vw" }}>
              New here ?
            </div>
            <div style={ registerButtonStyle } onMouseEnter={() => setRegisterIsHovered(true)} onMouseLeave={() => setRegisterIsHovered(false)}>
              Register
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}  

export default Login;
