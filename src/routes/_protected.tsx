import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import "@css/layout.css";


export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => {
    const stored = sessionStorage.getItem('user');
    const user = stored ? JSON.parse(stored) : null;

    if (!user) {
      throw redirect({
        to: '/auth/login',
        search: { returnTo: '/_protected/pages' },
      });
    }

    // Role-based access
    const allowedRoles = ['admin', 'vendor','client', 'trainee']; 
    if (!allowedRoles.includes(user.role)) {
      throw redirect({
        to: '/auth/unauthorized',
      });
    }

    return { user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { getUser } = useAuth();
  const currentUser = getUser();

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div
      className="body-wrapper"
      style={{ '--sidebar-width': isSidebarOpen ? '240px' : '48px' } as React.CSSProperties}
    >
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
