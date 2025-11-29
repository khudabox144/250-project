// hooks/useAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const getUser = () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('accessToken');
  };

  return { getUser, isAuthenticated };
};