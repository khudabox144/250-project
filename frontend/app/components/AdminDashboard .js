'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user safely from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      router.replace('/auth/login');
    }
    if (user === null) {
      router.replace('/auth/login');
    }
  }, [user, router]);

  if (!user) {
    return <p>Loading...</p>; // optional loader
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.name}!</p>
    </div>
  );
};

export default AdminDashboard;
