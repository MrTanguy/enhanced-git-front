import { useState } from 'react';

function Login() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [registerIsHovered, setRegisterIsHovered] = useState(false);
  const [loginIsHovered, setLoginIsHovered] = useState(false);

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

  /*
  bleu foncé : #4A81F8
  bleu : #739BF2
  bleu clair : #A8C0F3

  gris foncé : #404040
  gris : #A6A8AD
  gris clair : #F7F1F2
  */

  const registerButtonStyle = {
    borderRadius: "10px", 
    border: "2px solid #F7F1F2",
    backgroundColor: "#F7F1F2", 
    color: "#4A81F8", 
    padding: "3px",
    fontSize: "1.5vw",
    marginTop: "10px",
    boxShadow: registerIsHovered ? "0 4px 10px rgba(0, 0, 0, 0.5)" : "",
    cursor: "pointer",
    transition: "box-shadow 0.3s ease"
  } 

  const loginButtonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#739BF2',
    color: '#fff',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.5vw',
    boxShadow: loginIsHovered ? "0 4px 10px rgba(0, 0, 0, 0.5)" : "",
    cursor: "pointer",
    transition: "box-shadow 0.3s ease"
  }

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '2px solid #739BF2',
    fontSize: '1.2vw',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ width: "60%", height: "70%", backgroundColor: "#F7F1F2", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={{ height: "100%", width: "65%", border: "5px solid #739BF2", borderRight: 0, boxSizing: "border-box", display: "flex", justifyContent: "center"}}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <div style={{ fontSize: "2vw", marginBottom: "20px", color: "#4A81F8" }}>Connexion</div>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "1.2vw", color: "#404040" }}>Email :</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  style={ inputStyle } 
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "1.2vw", color: "#404040" }}>Mot de passe :</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  style={ inputStyle } 
                />
              </div>

              {errorMessage && <p style={{ color: 'red', fontSize: '1.2vw' }}>{errorMessage}</p>}

              <button 
                type="submit" 
                style={ loginButtonStyle } onMouseEnter={() => setLoginIsHovered(true)} onMouseLeave={() => setLoginIsHovered(false)}>
                Login
              </button>
            </form>
          </div>
        </div>
        <div style={{ height: "100%", width: "35%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
            <img src="/loginimage.svg" style={{ width: "100%", height: "100%", objectFit: "fill" }}/>
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
