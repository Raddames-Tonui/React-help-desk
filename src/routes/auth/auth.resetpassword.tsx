import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'react-hot-toast';
import "@/css/register.css"

export const Route = createFileRoute('/auth/auth/resetpassword')({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!usernameOrEmail) return toast.error('Username or Email required');
    if (!newPassword) return toast.error('New password required');
    if (newPassword !== confirmPassword)
      return toast.error('Passwords do not match');

    const users = JSON.parse(localStorage.getItem('users') || '[]') as {
      username: string;
      email: string;
      password: string;
      role: 'client' | 'vendor';
    }[];

    const userIndex = users.findIndex(
      user => user.username === usernameOrEmail || user.email === usernameOrEmail
    );

    if (userIndex === -1) {
      return toast.error('User not found');
    }

    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    toast.success('Password reset successful!', { duration: 1500 });

    setTimeout(() => {
      navigate({ to: '/auth/login' });
    }, 1500);
  };

  return (
    <div className="reset-wrapper">
      <form onSubmit={handleSubmit} className="reset-form">
        <h2 className="reset-title">Reset Password</h2>

        <label className="form-label">Username or Email:</label>
        <input
          type="text"
          value={usernameOrEmail}
          onChange={e => setUsernameOrEmail(e.target.value)}
          className="form-input"
          placeholder="Enter username or email"
          required
        />

        <label className="form-label">New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="form-input"
          placeholder="Enter new password"
          required
        />

        <label className="form-label">Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="form-input"
          placeholder="Confirm new password"
          required
        />

        <button type="submit" className="reset-btn">
          Reset Password
        </button>
      </form>
    </div>
  );
}
