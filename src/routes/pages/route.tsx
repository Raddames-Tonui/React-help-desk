import { createFileRoute, Outlet } from '@tanstack/react-router';
import Navbar from '@components/Navbar';
import Sidebar from '@components/Sidebar';
import Footer from '@components/Footer';
import "@css/layout.css";
import { useState } from 'react';

export const Route = createFileRoute('/pages')({
  component: PageLayout,
});

function PageLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div
      className="body-wrapper"
      style={{
        gridTemplateColumns: isSidebarOpen ? "240px 1fr" : "48px 1fr"
      }}
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
