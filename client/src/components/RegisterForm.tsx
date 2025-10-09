import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RegisterFormProps {
  onToggleMode: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('📝 Form: Submit button clicked');
    e.preventDefault();
    setError('');

    console.log('📝 Form: Validating inputs...', { username, email, passwordLength: password.length, confirmPasswordLength: confirmPassword.length });

    if (password !== confirmPassword) {
      console.log('❌ Form: Passwords do not match');
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      console.log('❌ Form: Password too short');
      setError('Password must be at least 6 characters long');
      return;
    }

    console.log('✅ Form: Validation passed, starting registration...');
    setLoading(true);

    try {
      console.log('📝 Form: Calling register function...');
      await register(username, email, password);
      console.log('✅ Form: Registration completed successfully');
    } catch (err: any) {
      console.error('❌ Form: Registration failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} aria-describedby={error ? 'register-error' : undefined}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={20}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        {error && <div id="register-error" className="error-message" role="alert" aria-live="assertive">{error}</div>}
        <button 
          type="submit" 
          disabled={loading} 
          className="btn btn-primary"
          onClick={() => console.log('🖱️ Button: Register button clicked')}
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="auth-toggle">
        Already have an account?{' '}
        <button type="button" onClick={onToggleMode} className="link-button">
          Login here
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;
