import React, { useState } from 'react';
import { Button, Alert } from '@pradnyakuswara/ui';
import { InputEmail } from '../input/InputEmail';
import { InputPassword } from '../input/InputPassword';
import GoogleIcon, { googleOAuthUrl } from './GoogleIcon';
import ApiService, { type ApiResponse } from '../../services/api';

interface LoginResponseData {
  token: string;
  name: string;
}

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await ApiService.post<ApiResponse<LoginResponseData>>('/api/auth/login', { email, password });
      if (res.success && res.data?.token) {
        localStorage.setItem('AUTH_TOKEN', res.data.token);
        localStorage.setItem('user_logged_in', 'true');
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        setError(res.message || 'Login gagal');
      }
    } catch (err) {
      setError((err as Error).message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        fullWidth
        size="lg"
        leftIcon={<GoogleIcon />}
        onClick={() => (window.location.href = googleOAuthUrl())}
      >
        Masuk dengan Google
      </Button>

      <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)]">
        <span className="flex-1 border-t border-[var(--border-color)]" />
        atau
        <span className="flex-1 border-t border-[var(--border-color)]" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert variant="success">Login berhasil! Mengalihkan...</Alert>}

        <InputEmail
          label="Email"
          id="email"
          required
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="space-y-1">
          <div className="flex justify-end">
            <a href="#" className="text-xs text-[var(--color-primary)] hover:underline font-semibold">
              Lupa Password?
            </a>
          </div>
          <InputPassword
            label="Password"
            id="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" fullWidth size="lg" isLoading={loading} disabled={success}>
          Masuk Akun
        </Button>
      </form>
    </div>
  );
}
