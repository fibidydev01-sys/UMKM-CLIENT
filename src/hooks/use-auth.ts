'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { authApi, getErrorMessage } from '@/lib/api';
import { toast } from '@/providers';
import type { LoginInput, RegisterInput } from '@/types';

// ==========================================
// USE AUTH HOOK
// ==========================================

export function useAuth() {
  const store = useAuthStore();

  return {
    tenant: store.tenant,
    isAuthenticated: !!store.tenant,
    isLoading: store.isLoading,
    isChecked: store.isChecked,
    setTenant: store.setTenant,
    reset: store.reset,
  };
}

// ==========================================
// USE AUTH CHECK HOOK
// ==========================================

export function useAuthCheck() {
  const { setTenant, setChecked, isChecked } = useAuthStore();

  const checkAuth = useCallback(async () => {
    if (isChecked) return;

    try {
      const response = await authApi.status();

      if (response.authenticated && response.tenant) {
        setTenant(response.tenant);
      } else {
        setTenant(null);
      }
    } catch {
      setTenant(null);
    } finally {
      setChecked(true);
    }
  }, [isChecked, setTenant, setChecked]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { checkAuth };
}

// ==========================================
// USE LOGIN HOOK
// ==========================================

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setTenant, setChecked } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const login = useCallback(
    async (data: LoginInput) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authApi.login(data);

        setTenant(response.tenant);
        setChecked(true);

        toast.success('Login berhasil!', `Selamat datang, ${response.tenant.name}`);

        const from = searchParams.get('from');
        router.push(from || '/dashboard');

        return response;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        toast.error('Login gagal', message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setTenant, setChecked, router, searchParams],
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return { login, isLoading, error, reset };
}

// ==========================================
// USE REGISTER HOOK
// ==========================================

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setTenant, setChecked } = useAuthStore();
  const router = useRouter();

  const register = useCallback(
    async (data: RegisterInput) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authApi.register(data);

        setTenant(response.tenant);
        setChecked(true);

        toast.success('Pendaftaran berhasil!', 'Toko Anda sudah siap digunakan');
        router.push('/dashboard');

        return response;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        toast.error('Pendaftaran gagal', message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setTenant, setChecked, router],
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return { register, isLoading, error, reset };
}

// ==========================================
// USE LOGOUT HOOK
// ==========================================

export function useLogout() {
  const { reset } = useAuthStore();
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore error
    }

    reset();
    toast.success('Logout berhasil');
    router.push('/login');
  }, [reset, router]);

  return { logout };
}

// ==========================================
// USE CHECK SLUG HOOK
// ==========================================

export function useCheckSlug() {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const checkSlug = useCallback(async (slug: string) => {
    if (slug.length < 3) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);

    try {
      const response = await authApi.checkSlug(slug);
      setIsAvailable(response.available);
    } catch {
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsAvailable(null);
  }, []);

  return { checkSlug, isChecking, isAvailable, reset };
}

// ==========================================
// PLACEHOLDER HOOKS
// ==========================================

export function useChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_currentPassword: string, _newPassword: string) => {
      setIsLoading(true);
      setError(null);

      try {
        toast.success('Password berhasil diubah');
        return true;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        toast.error('Gagal mengubah password', message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { changePassword, isLoading, error };
}

export function useDeleteAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAccount = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      toast.success('Akun berhasil dihapus');
      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error('Gagal menghapus akun', message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { deleteAccount, isLoading, error };
}