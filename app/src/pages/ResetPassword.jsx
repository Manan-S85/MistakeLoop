import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setMessage("Invalid reset link");
    }
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token, 
          newPassword 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMessage(data.message || "Error resetting password");
      }
    } catch (error) {
      setMessage("Error resetting password");
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="max-w-sm mx-auto mt-40">
        <div className="bg-red-100 text-red-800 p-4 rounded text-center">
          Invalid or missing reset token
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-40">
      <h2 className="text-2xl font-bold mb-6 text-center">Set New Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 mb-3 border rounded"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
          minLength={6}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full p-2 mb-3 border rounded"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
        <button 
          className="bg-blue-600 text-white w-full py-2 rounded disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      
      {message && (
        <div className={`mt-3 p-2 rounded text-center ${
          message.includes('successful') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <div className="mt-6 text-center">
        <button 
          className="text-blue-600 underline"
          onClick={() => navigate('/')}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}