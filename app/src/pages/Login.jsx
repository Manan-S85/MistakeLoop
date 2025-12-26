import { useState } from "react";
import { login } from "../api/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await login(email, password);
      onLogin(data);
    } catch (error) {
      setMessage("Invalid credentials");
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage("Password reset email sent! Check your inbox.");
        setShowForgotPassword(false);
        setForgotPasswordEmail("");
      } else {
        setMessage(data.message || "Error sending reset email");
      }
    } catch (error) {
      setMessage("Error sending reset email");
    }
  }

  if (showForgotPassword) {
    return (
      <div className="max-w-sm mx-auto mt-40">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 mb-3 border rounded"
            value={forgotPasswordEmail}
            onChange={e => setForgotPasswordEmail(e.target.value)}
            required
          />
          <button className="bg-blue-600 text-white w-full py-2 mb-3 rounded">
            Send Reset Email
          </button>
        </form>
        <button 
          className="text-blue-600 underline w-full text-center"
          onClick={() => setShowForgotPassword(false)}
        >
          Back to Login
        </button>
        {message && (
          <div className={`mt-3 p-2 rounded text-center ${
            message.includes('sent') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-40">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white w-full py-2 rounded">
          Login
        </button>
      </form>
      <button 
        className="text-blue-600 underline w-full text-center mt-3"
        onClick={() => setShowForgotPassword(true)}
      >
        Forgot Password?
      </button>
      {message && (
        <div className="mt-3 p-2 bg-red-100 text-red-800 rounded text-center">
          {message}
        </div>
      )}
    </div>
  );
}
