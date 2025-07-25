import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseAuth } from '../../hooks/AuthProvider';
import '../../styles/register.css';

function RegisterForm() {
    const navigate = useNavigate();
    const { register } = UseAuth();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState([]);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address.';
    const validatePassword = (value) => {
        const errors = [];
        if (value.length < 8) errors.push('At least 8 characters.');
        if (!/[A-Z]/.test(value)) errors.push('One uppercase letter.');
        if (!/[a-z]/.test(value)) errors.push('One lowercase letter.');
        if (!/[0-9]/.test(value)) errors.push('One number.');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) errors.push('One special character.');
        return errors;
    };
    const validateConfirmPassword = (value) => value !== password ? 'Passwords do not match.' : '';

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
            await register(email, password);
            navigate("/dashboard");
        } catch (err) {
            setErrorMessage(err.message);
        }
    };

    const isFormValid = (
        emailError === '' &&
        passwordError.length === 0 &&
        confirmPasswordError === '' &&
        email !== '' &&
        password !== '' &&
        confirmPassword !== ''
    );

    return (
        <div className="register-wrapper">
            <div className="register-container">
                <div className="register-left">
                    <div className="register-form-wrapper">
                        <div className="register-title">Register</div>
                        <form onSubmit={handleSubmit} className='test'>
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                    placeholder="Email"
                                    className="input"
                                    aria-label="Email address"
                                />
                            </div>
                            {emailError && <p style={{ color: 'red', fontSize: '12px' }}>{emailError}</p>}
                            <div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                    placeholder="Password"
                                    className="input"
                                    aria-label="Password"
                                />
                            </div>
                            {passwordError.length > 0 && (
                                <ul style={{ color: 'red', fontSize: '12px' }}>
                                    {passwordError.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            )}
                            <div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    required
                                    placeholder="Confirm password"
                                    className="input"
                                    aria-label="Confirm password"
                                />
                            </div>
                            {confirmPasswordError && <p style={{ color: 'red', fontSize: '12px' }}>{confirmPasswordError}</p>}
                            {errorMessage && <p style={{ color: 'red', fontSize: '20px' }}>{errorMessage}</p>}
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button
                                    type="submit"
                                    className="submitButton"
                                    disabled={!isFormValid}
                                    aria-label="Register submit"
                                >
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="register-right">
                    <img
                        src="/loginimage.svg"
                        className="register-image"
                        alt="Illustration de connexion"
                    />
                    <div className="register-overlay">
                        <div className="register-overlay-text">Already have an account ?</div>
                        <a
                            className="swapLoginButton"
                            onClick={() => navigate('/login')}
                            aria-label="Go to login"
                        >
                            Login
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
