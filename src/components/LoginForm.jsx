import { useState } from 'react';

function Login() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("paf")

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

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
        <h2>Connexion</h2>

        <div>
          <label>Email :</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }} 
          />
        </div>

        <div>
          <label>Mot de passe :</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }} 
          />
        </div>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <button 
          type="submit" 
          style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default Login;
