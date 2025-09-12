import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'react-hot-toast';

export const Route = createFileRoute('/_auth/auth/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'vendor'>('client');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      return toast.error('Username and password are required');
    }

    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]') as {
      username: string;
      password: string;
      role: 'client' | 'vendor';
    }[];

    // Check if username already exists
    if (existingUsers.find(user => user.username === username)) {
      return toast.error('Username already exists');
    }

    // Add new user
    const updatedUsers = [...existingUsers, { username, password, role }];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    toast.success('Registration successful!');

    // Optional: redirect to login after 1.5s
    setTimeout(() => {
      navigate({ to: '/auth/login' });
    }, 1500);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl mb-6 text-center font-semibold">Sign Up</h2>

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
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
