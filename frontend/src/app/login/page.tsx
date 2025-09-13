'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useLogin } from '@/hooks/use-auth';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/input';
import { Card } from '@/components/primitives/card';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading('Enviando credenciales...');
    try {
      await loginMutation.mutateAsync(credentials);
      toast.success('¡Login exitoso!');
    } catch (error) {
      toast.error('Error al iniciar sesión');
      console.error('Error en login:', error);
    } finally {
      toast.dismiss();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const hasError = Boolean(loginMutation.error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181c2b] via-[#23232b] to-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
            Iniciar Sesión
          </h2>
        </div>

        <Card className="p-8 bg-gradient-to-br from-[#181c2b] via-[#23232b] to-[var(--background)] border-0 shadow-lg backdrop-blur-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--foreground)]"
              >
                Email
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--foreground)]"
              >
                Contraseña
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending
                  ? 'Iniciando sesión...'
                  : 'Iniciar Sesión'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
