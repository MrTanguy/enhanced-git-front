import { useState, useEffect } from 'react';
import '../styles/connections.css';

function Register() {

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState("");
    const [debouncedEmail, setDebouncedEmail] = useState("");

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [debouncedPassword, setDebouncedPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [debouncedConfirmPassword, setConfirmDebouncedPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState('');

    // #########
    // # EMAIL #
    // #########

    // Vérifie si l'email est vide, sinon attend 500ms avant de lancer la vérification
    useEffect(() => {
        if (email === "") {
            setEmailError(""); 
            return;
        }

        const timer = setTimeout(() => {
            setDebouncedEmail(email);
        }, 500); 

        return () => clearTimeout(timer); 
    }, [email]);

    // Vérifie si l'entrée est bien une adresse email
    useEffect(() => {
        if (!debouncedEmail) return; 

        const validateEmail = (value) => {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return "Please enter a valid email address.";
            }
            return "";
        };

        const error = validateEmail(debouncedEmail);
        setEmailError(error);
    }, [debouncedEmail]);

    // ############
    // # PASSWORD #
    // ############
    useEffect(() => {
        if (password === "") {
            setPasswordError(""); 
            return;
        }

        const timer = setTimeout(() => {
            setDebouncedPassword(password);
        }, 500); 

        return () => clearTimeout(timer); 
    }, [password]);

    useEffect(() => {
        if (!debouncedPassword) return;
    
        const validatePassword = (value) => {
          const errors = [];
          if (value.length < 8) errors.push("At least 8 characters.");
          if (!/[A-Z]/.test(value)) errors.push("One uppercase letter.");
          if (!/[a-z]/.test(value)) errors.push("One lowercase letter.");
          if (!/[0-9]/.test(value)) errors.push("One number.");
          if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) errors.push("One special character.");
    
          return errors;
        };
    
        const errors = validatePassword(debouncedPassword);
        setPasswordError(errors);
      }, [debouncedPassword]);
    
    const handleSubmit = (event) => {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append("username", email);
        formData.append("password", password);
    
        fetch('https://127.0.0.1:8000/auth/register', {
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
          <div style={{ width: "60%", height: "70%", backgroundColor: "#F7F1F2", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div style={{ height: "100%", width: "65%", border: "5px solid #739BF2", borderRight: 0, boxSizing: "border-box", display: "flex", justifyContent: "center"}}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", width: "60%" }}>
                <div style={{ fontSize: "2vw", marginBottom: "20px", color: "#4A81F8" }}>Register</div>
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
                  {emailError && <p style={{ color: "red", fontSize: "12px" }}>{emailError}</p>}
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
                  {passwordError.length > 0 && (
                    <ul style={{ color: "red", fontSize: "0.9rem" }}>
                    {passwordError.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                    </ul>
                  )}
                  <div style={{ marginBottom: "2%" }}>
                  <input 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      required 
                      placeholder="Confirm password"
                      className='inputStyle'
                    />
                  </div>
                  {confirmPasswordError && <p style={{ color: "red", fontSize: "12px" }}>{emailError}</p>}
                  {errorMessage && <p style={{ color: 'red', fontSize: '1.2vw' }}>{errorMessage}</p>}
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button 
                      type="submit" 
                      className='submitButtonStyle'>
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div style={{ height: "100%", width: "35%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                <img src="/svg/loginimage.svg" style={{ width: "100%", height: "100%", objectFit: "fill" }} alt='LoginSVG'/>
                <div style={{ position: "absolute", color: "#F7F1F2", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                    <div style={{ fontSize: "1.2vw" }}>
                    Already have an account ?
                    </div>
                    <a className='swapLoginButtonStyle' href='/login'>
                    Login
                    </a>
              </div>
            </div>
          </div>
        </div>
    );
}

export default Register;