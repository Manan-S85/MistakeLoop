import { useState } from "react";

export default function HomePage({ onLogin }) {
  const [showLogin, setShowLogin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const endpoint = isRegistering ? 'register' : 'login';
      const payload = isRegistering ? formData : {
        email: formData.email,
        password: formData.password
      };

      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (isRegistering) {
        setIsRegistering(false);
        setMessage('Registration successful! Please login.');
        setFormData({ name: '', email: '', password: '' });
      } else {
        onLogin(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();
      
      if (response.ok && data.userExists) {
        setMessage("User verified! You can now create a new password.");
        // Move to password reset form
        setTimeout(() => {
          setShowForgotPassword(false);
          setShowPasswordReset(true);
          setMessage('');
        }, 1500);
      } else {
        setError(data.message || "User not found in our database");
      }
    } catch (error) {
      setError("Error verifying user");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: forgotPasswordEmail,
          newPassword 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage("Password updated successfully! You can now login with your new password.");
        setTimeout(() => {
          // Reset all states and go back to login
          setShowPasswordReset(false);
          setShowForgotPassword(false);
          setForgotPasswordEmail('');
          setNewPassword('');
          setConfirmPassword('');
          setMessage('');
          setError('');
        }, 2000);
      } else {
        setError(data.message || "Error updating password");
      }
    } catch (error) {
      setError("Error updating password");
    } finally {
      setLoading(false);
    }
  };

  if (showLogin) {
    // Password Reset Form (Step 2)
    if (showPasswordReset) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(25, 25, 55, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '48px',
            maxWidth: '420px',
            width: '100%',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <button
              onClick={() => {
                setShowPasswordReset(false);
                setShowForgotPassword(false);
                setError('');
                setMessage('');
                setForgotPasswordEmail('');
                setNewPassword('');
                setConfirmPassword('');
              }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '24px',
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.color = '#ffffff'}
              onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
            >
              ×
            </button>

            <h2 style={{
              color: '#ffffff',
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '8px',
              textAlign: 'center',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              Create New Password
            </h2>

            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '16px',
              textAlign: 'center',
              marginBottom: '32px',
              lineHeight: '1.5'
            }}>
              Enter your new password for {forgotPasswordEmail}
            </p>

            <form onSubmit={handlePasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError('');
                    setMessage('');
                  }}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                    setMessage('');
                  }}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                />
              </div>

              {(error || message) && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: message ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: message ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                  color: message ? '#86efac' : '#fca5a5',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {error || message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: loading ? 'rgba(100, 100, 100, 0.5)' : 'linear-gradient(135deg, #4169E1 0%, #87CEEB 100%)',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: loading ? 'none' : '0 4px 14px 0 rgba(65, 105, 225, 0.39)'
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px 0 rgba(65, 105, 225, 0.5)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = '0 4px 14px 0 rgba(65, 105, 225, 0.39)';
                  }
                }}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '24px',
              fontSize: '14px'
            }}>
              <button
                onClick={() => {
                  setShowPasswordReset(false);
                  setShowForgotPassword(true);
                  setError('');
                  setMessage('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'color 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.color = '#ffffff'}
                onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                Back to Email Verification
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Forgot Password Form (Step 1)
    if (showForgotPassword) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(25, 25, 55, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '48px',
            maxWidth: '420px',
            width: '100%',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setError('');
                setMessage('');
                setForgotPasswordEmail('');
              }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '24px',
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.color = '#ffffff'}
              onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
            >
              ×
            </button>

            <h2 style={{
              color: '#ffffff',
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '8px',
              textAlign: 'center',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              Verify Your Account
            </h2>

            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '16px',
              textAlign: 'center',
              marginBottom: '32px',
              lineHeight: '1.5'
            }}>
              Enter your email address to verify your account and reset your password
            </p>

            <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={forgotPasswordEmail}
                  onChange={(e) => {
                    setForgotPasswordEmail(e.target.value);
                    setError('');
                    setMessage('');
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                />
              </div>

              {(error || message) && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: message ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: message ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                  color: message ? '#86efac' : '#fca5a5',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {error || message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: loading ? 'rgba(100, 100, 100, 0.5)' : 'linear-gradient(135deg, #4169E1 0%, #87CEEB 100%)',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: loading ? 'none' : '0 4px 14px 0 rgba(65, 105, 225, 0.39)'
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px 0 rgba(65, 105, 225, 0.5)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = '0 4px 14px 0 rgba(65, 105, 225, 0.39)';
                  }
                }}
              >
                {loading ? 'Verifying...' : 'Verify Account'}
              </button>
            </form>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '24px',
              fontSize: '14px'
            }}>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setError('');
                  setMessage('');
                  setForgotPasswordEmail('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'color 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.color = '#ffffff'}
                onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Regular Login/Register Form
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1000
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(25, 25, 55, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '48px',
          maxWidth: '420px',
          width: '100%',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <button
            onClick={() => setShowLogin(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '24px',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.color = '#ffffff'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
          >
            ×
          </button>

          <h2 style={{
            color: '#ffffff',
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '8px',
            textAlign: 'center',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            {isRegistering ? 'Join MistakeLoop' : 'Welcome back'}
          </h2>

          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '16px',
            textAlign: 'center',
            marginBottom: '32px',
            lineHeight: '1.5'
          }}>
            {isRegistering ? 'Create your account to start tracking interview insights' : 'Sign in to continue your journey'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {isRegistering && (
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                />
              </div>
            )}
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>

            {error && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#fca5a5',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            {message && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                color: '#86efac',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                background: loading ? 'rgba(100, 100, 100, 0.5)' : 'linear-gradient(135deg, #4169E1 0%, #87CEEB 100%)',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: loading ? 'none' : '0 4px 14px 0 rgba(65, 105, 225, 0.39)'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px 0 rgba(65, 105, 225, 0.5)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0px)';
                  e.target.style.boxShadow = '0 4px 14px 0 rgba(65, 105, 225, 0.39)';
                }
              }}
            >
              {loading ? 'Please wait...' : (isRegistering ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          {/* Forgot Password Link - Only show for login, not registration */}
          {!isRegistering && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px',
              fontSize: '14px'
            }}>
              <button
                onClick={() => {
                  setShowForgotPassword(true);
                  setError('');
                  setMessage('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'color 0.2s ease',
                  textDecoration: 'underline'
                }}
                onMouseOver={(e) => e.target.style.color = '#ffffff'}
                onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '24px',
            fontSize: '14px'
          }}>
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setMessage('');
                setFormData({ name: '', email: '', password: '' });
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.color = '#ffffff'}
              onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
            >
              {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff',
      margin: 0,
      padding: 0,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      position: 'relative'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '800px',
        height: '800px',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'float 20s ease-in-out infinite',
        zIndex: 1
      }}></div>

      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-15%',
        width: '600px',
        height: '600px',
        background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 142, 83, 0.1) 100%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 25s ease-in-out infinite reverse',
        zIndex: 1
      }}></div>

      {/* Flowing curve elements */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          pointerEvents: 'none'
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="curve1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: 'rgba(102, 126, 234, 0.3)', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: 'rgba(118, 75, 162, 0.1)', stopOpacity: 1}} />
          </linearGradient>
          <linearGradient id="curve2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: 'rgba(255, 107, 107, 0.2)', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: 'rgba(255, 142, 83, 0.1)', stopOpacity: 1}} />
          </linearGradient>
        </defs>
        <path
          d="M1200,0 C1400,200 1600,400 1920,300 L1920,0 Z"
          fill="url(#curve1)"
          style={{ animation: 'morphing 15s ease-in-out infinite' }}
        />
        <path
          d="M800,1080 C1000,800 1200,600 1920,700 L1920,1080 Z"
          fill="url(#curve2)"
          style={{ animation: 'morphing 20s ease-in-out infinite reverse' }}
        />
      </svg>

      {/* Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '32px 64px',
        position: 'relative',
        zIndex: 10,
        background: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div 
          onClick={() => {
            // Try multiple methods to ensure we get to the top
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            window.scrollTo(0, 0);
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          }}
          style={{
          fontSize: '28px',
          fontWeight: '800',
          color: '#ffffff',
          letterSpacing: '-0.5px',
          cursor: 'pointer',
          transition: 'opacity 0.2s ease'
        }}
        onMouseOver={(e) => e.target.style.opacity = '0.8'}
        onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          MistakeLoop
        </div>
        
        <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '40px' }}>
            <span 
              onClick={() => {
                // Try multiple methods to ensure we get to the top
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
                window.scrollTo(0, 0);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.target.style.color = '#ffffff'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
            >Home</span>
            <span 
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.target.style.color = '#ffffff'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
            >What we do</span>
            <span 
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.target.style.color = '#ffffff'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
            >Features</span>
            <span 
              onClick={() => document.getElementById('cta').scrollIntoView({ behavior: 'smooth' })}
              style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.target.style.color = '#ffffff'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
            >About us</span>

          </div>
          
          <button
            onClick={() => setShowLogin(true)}
            style={{
              padding: '12px 28px',
              borderRadius: '50px',
              border: 'none',
              background: 'linear-gradient(135deg, #4169E1 0%, #87CEEB 100%)',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 14px 0 rgba(65, 105, 225, 0.39)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px 0 rgba(65, 105, 225, 0.5)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0px)';
              e.target.style.boxShadow = '0 4px 14px 0 rgba(65, 105, 225, 0.39)';
            }}
          >
            Get in touch →
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" style={{
        padding: '60px 64px 40px 64px',
        position: 'relative',
        zIndex: 5,
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '80px',
          alignItems: 'center'
        }}>
          <div style={{ maxWidth: '800px' }}>
            <h1 style={{
              fontSize: 'clamp(48px, 6vw, 84px)',
              fontWeight: '800',
              lineHeight: '0.95',
              marginBottom: '40px',
              color: '#ffffff',
              letterSpacing: '-2px',
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Interview intelligence that matters,{' '}
              <span style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                crafted by people who care.
              </span>
            </h1>

            <p style={{
              fontSize: '22px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6',
              marginBottom: '60px',
              fontWeight: '400',
              maxWidth: '600px'
            }}>
              Only mistakes can truly improve a person. Every failure teaches us what success cannot. MistakeLoop transforms your interview setbacks into stepping stones, because growth happens in the loop of learning from what went wrong.
            </p>

            <button
              onClick={() => setShowLogin(true)}
              style={{
                padding: '20px 48px',
                borderRadius: '50px',
                border: 'none',
                background: 'linear-gradient(135deg, #4169E1 0%, #87CEEB 100%)',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: '0 8px 32px 0 rgba(65, 105, 225, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 12px 48px 0 rgba(65, 105, 225, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = '0 8px 32px 0 rgba(65, 105, 225, 0.4)';
              }}
            >
              Start Your Journey →
            </button>
          </div>

          {/* Process Flow */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            alignItems: 'flex-end',
            opacity: '0.8'
          }}>
            {[
              { step: 'Mistake', icon: '❌' },
              { step: 'Detection', icon: '🔍' },
              { step: 'Feedback', icon: '💡' },
              { step: 'Action', icon: '⚡' },
              { step: 'Review', icon: '📊' },
              { step: 'Repeat if unfixed', icon: '🔄' }
            ].map((item, index) => (
              <div
                key={item.step}
                style={{
                  padding: '16px 20px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.9)',
                  animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease',
                  cursor: 'default'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateX(-8px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateX(0px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span>{item.step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why MistakeLoop is Different */}
      <section style={{
        padding: '60px 64px',
        position: 'relative',
        zIndex: 5,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '24px'
            }}>
              What Makes Us Different
            </div>
            
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '32px',
              letterSpacing: '-1px',
              lineHeight: '1.2'
            }}>
              Unlike Other Platforms, We <span style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Actually Talk With You</span>
            </h2>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>💬</div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#ffffff',
                    margin: 0
                  }}>Conversational AI Analysis</h3>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Our advanced LLM doesn't just analyze text - it engages in real conversations with you, understanding context, emotions, and nuanced details other platforms miss.
                </p>
              </div>
              
              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>🎯</div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#ffffff',
                    margin: 0
                  }}>Personal Feedback Coach</h3>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Instead of generic reports, you get a personalized AI coach that asks follow-up questions, clarifies your experiences, and provides tailored improvement strategies.
                </p>
              </div>
              
              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>🔄</div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#ffffff',
                    margin: 0
                  }}>Continuous Learning Loop</h3>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  The AI remembers your journey, building on previous conversations to create an evolving strategy that adapts as you grow and improve.
                </p>
              </div>
            </div>
          </div>
          
          <div style={{
            position: 'relative',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '400px',
              height: '450px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              padding: '32px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                right: '20px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: '600'
              }}>
                💬 MistakeLoop AI Coach
              </div>
              
              <div style={{
                marginTop: '60px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                height: 'calc(100% - 80px)',
                overflowY: 'hidden'
              }}>
                <div style={{
                  alignSelf: 'flex-start',
                  maxWidth: '80%',
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px 12px 12px 4px',
                  color: '#ffffff',
                  fontSize: '13px',
                  lineHeight: '1.4'
                }}>
                  Hi! I noticed you mentioned feeling nervous during technical questions. Can you tell me more about what specifically made you feel that way?
                </div>
                
                <div style={{
                  alignSelf: 'flex-end',
                  maxWidth: '80%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px 12px 4px 12px',
                  color: '#ffffff',
                  fontSize: '13px',
                  lineHeight: '1.4'
                }}>
                  I think I struggled with explaining my thought process while coding...
                </div>
                
                <div style={{
                  alignSelf: 'flex-start',
                  maxWidth: '80%',
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px 12px 12px 4px',
                  color: '#ffffff',
                  fontSize: '13px',
                  lineHeight: '1.4'
                }}>
                  That's a common challenge! Let's work on strategies to verbalize your coding process. Have you tried the "rubber duck" method before?
                </div>
                
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  right: '20px',
                  height: '40px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '16px',
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  Type your response...
                  <div style={{
                    marginLeft: 'auto',
                    marginRight: '16px',
                    width: '8px',
                    height: '8px',
                    background: '#667eea',
                    borderRadius: '50%',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section id="features" style={{
        padding: '60px 64px',
        position: 'relative',
        zIndex: 5,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          textAlign: 'center',
          marginBottom: '80px'
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 56px)',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '24px',
            letterSpacing: '-1px'
          }}>
            How MistakeLoop Works
          </h2>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.6)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Our AI-powered platform turns your interview experiences into actionable insights for career growth.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '40px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {[
            {
              icon: '🎯',
              title: 'Track Interview Patterns',
              description: 'Log your interview experiences, questions, and outcomes to identify recurring challenges and improvement areas.',
              gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            },
            {
              icon: '🧠',
              title: 'AI-Powered Analysis',
              description: 'Our intelligent system analyzes your patterns, provides personalized feedback, and suggests targeted improvements.',
              gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            },
            {
              icon: '📈',
              title: 'Measure Your Growth',
              description: 'Track your progress over time with detailed analytics and celebrate your interview success milestones.',
              gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
            }
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                padding: '40px 32px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '48px',
                marginBottom: '24px',
                display: 'inline-block'
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '16px',
                letterSpacing: '-0.5px'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: '1.6',
                margin: 0
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" style={{
        padding: '40px 64px 40px 64px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '24px',
            letterSpacing: '-1px'
          }}>
            Ready to Transform Your Interview Success?
          </h2>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.6)',
            lineHeight: '1.6',
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto 48px auto'
          }}>
            Join thousands of professionals who have mastered their interview skills and landed their dream jobs.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowLogin(true)}
              style={{
                padding: '20px 48px',
                borderRadius: '50px',
                border: 'none',
                background: 'linear-gradient(135deg, #4169E1 0%, #87CEEB 100%)',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: '0 8px 32px 0 rgba(65, 105, 225, 0.4)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 12px 48px 0 rgba(65, 105, 225, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = '0 8px 32px 0 rgba(65, 105, 225, 0.4)';
              }}
            >
              Get Started Now →
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          transition: all 0.2s ease;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
        }
        
        /* Firefox Scrollbar */
        * {
          scrollbar-width: thin;
          scrollbar-color: #667eea rgba(0, 0, 0, 0.2);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        
        @keyframes morphing {
          0%, 100% { d: path("M1200,0 C1400,200 1600,400 1920,300 L1920,0 Z"); }
          50% { d: path("M1000,0 C1300,150 1500,350 1920,250 L1920,0 Z"); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}