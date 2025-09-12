import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'react-hot-toast';
// import { Route as AuthLayoutRoute } from './__layout'; 

export const Route = createFileRoute('/_auth/auth/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'vendor'>('client');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) return toast.error('Username required');
    if (!password) return toast.error('Password required');

    // Get registered users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]') as {
      username: string;
      password: string;
      role: 'client' | 'vendor';
    }[];

    // Find matching user
    const matchedUser = users.find(
      user => user.username === username && user.password === password && user.role === role
    );

    if (!matchedUser) {
      return toast.error('Invalid credentials or role');
    }

    // Store logged-in user in sessionStorage
    sessionStorage.setItem('username', matchedUser.username);
    sessionStorage.setItem('role', matchedUser.role);

    toast.success('Login successful!', { duration: 1500 });

    // Redirect after toast
    setTimeout(() => {
      navigate({ to: role === 'client' ? '/pages/client' : '/pages/vendor' });
    }, 1500);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl mb-6 text-center font-semibold">Login</h2>

        <label className="block mb-2">Username:</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter username"
          required
        />

        <label className="block mb-2">Password:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter password"
          required
        />

        <label className="block mb-2">Role:</label>
        <select
          value={role}
          onChange={e => setRole(e.target.value as 'client' | 'vendor')}
          className="w-full p-2 border rounded mb-6"
        >
          <option value="client">Client</option>
          <option value="vendor">Vendor</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
