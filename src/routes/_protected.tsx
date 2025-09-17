import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import "@css/layout.css";
import { useState } from 'react';
import { ODataProvider } from '../context/ODataContext';

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ context }) => {
    const user = context.auth.getUser();

    // no user? → redirect to login
    if (!user) {
      throw redirect({
        to: '/auth/login',
        search: {
          returnTo: '/_protected/pages',
        },
      });
    }

    return { user }; 
  },
  component: PageLayout,
});

function PageLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div
      className="body-wrapper"
      style={
        {
          "--sidebar-width": isSidebarOpen ? "240px" : "48px",
        } as React.CSSProperties
      }
    >
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main>
        <ODataProvider>
          <Outlet />
        </ODataProvider>
      </main>
      <Footer />
    </div>
  );
}
