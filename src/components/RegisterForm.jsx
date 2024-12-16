import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseAuth } from '../hooks/AuthProvider';
import '../styles/connections.css';

function RegisterForm() {
    const navigate = useNavigate();
    const { register } = UseAuth()

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState([]);

    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    // Validation functions
    const validateEmail = (value) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Please enter a valid email address.';
        }
        return '';
    };

    const validatePassword = (value) => {
        const errors = [];
        if (value.length < 8) errors.push('At least 8 characters.');
        if (!/[A-Z]/.test(value)) errors.push('One uppercase letter.');
        if (!/[a-z]/.test(value)) errors.push('One lowercase letter.');
        if (!/[0-9]/.test(value)) errors.push('One number.');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) errors.push('One special character.');
        return errors;
    };

    const validateConfirmPassword = (value) => {
        if (value !== password) {
            return 'Passwords do not match.';
        }
        return '';
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setEmailError(validateEmail(value));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordError(validatePassword(value));
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setConfirmPasswordError(validateConfirmPassword(value));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await register(email, password)
            navigate("/dashboard")
        } catch (err) {
          setErrorMessage(err.message)
        }
    };

    const isFormValid =
        emailError === '' &&
        passwordError.length === 0 &&
        confirmPasswordError === '' &&
        email !== '' &&
        password !== '' &&
        confirmPassword !== '';

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
            <div style={{ width: '60%', height: '70%', backgroundColor: '#F7F1F2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                <div style={{ height: '100%', width: '65%', border: '5px solid #739BF2', borderRight: 0, boxSizing: 'border-box', display: 'flex', justifyContent: 'center', }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '50%' }}>
                        <div style={{ fontSize: '2vw', marginBottom: '20px', color: '#4A81F8' }}>Register</div>
                          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                              <div style={{ marginBottom: '2%' }}>
                                  <input type="email" value={email} onChange={handleEmailChange} required placeholder="Email"  className="input" />
                              </div>
                              {emailError && <p style={{ color: 'red', fontSize: '12px' }}>{emailError}</p>}
                              <div style={{ marginBottom: '2%' }}>
                                  <input type="password" value={password} onChange={handlePasswordChange}  required placeholder="Password" className="input" />
                              </div>
                              {passwordError.length > 0 && (
                                  <ul style={{ color: 'red', fontSize: '12px' }}>
                                      {passwordError.map((error, index) => (<li key={index}>{error}</li>))}
                                  </ul>
                              )}
                              <div style={{ marginBottom: '2%' }}>
                                  <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} required placeholder="Confirm password" className="input" />
                              </div>
                              {confirmPasswordError && <p style={{ color: 'red', fontSize: '12px' }}>{confirmPasswordError}</p>}
                              {errorMessage && <p style={{ color: 'red', fontSize: '20px' }}>{errorMessage}</p>}
                              <div style={{ display: 'flex', justifyContent: 'center' }}>
                                  <button type="submit" className="submitButton" disabled={!isFormValid}>
                                      Register
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
                  <div style={{ height: "100%", width: "35%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                      <img src="/loginimage.svg" style={{ width: "100%", height: "100%", objectFit: "fill" }} alt='LoginSVG'/>
                      <div style={{ position: "absolute", color: "#F7F1F2", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                          <div style={{ fontSize: "1.2vw" }}>
                            Already have an account ?
                          </div>
                          <a className='swapLoginButton' onClick={() => {navigate('/login')}}>
                            Login
                          </a>
                      </div>
                  </div>  
              </div>
        </div>
    );
}

export default RegisterForm;
