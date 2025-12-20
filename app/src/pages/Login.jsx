import { useState } from "react";
import { login } from "../api/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const data = await login(email, password);
    onLogin(data);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-40">
      <input
        placeholder="Email"
        className="w-full p-2 mb-3"
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-3"
        onChange={e => setPassword(e.target.value)}
      />
      <button className="bg-blue-600 text-white w-full py-2">
        Login
      </button>
    </form>
  );
}
