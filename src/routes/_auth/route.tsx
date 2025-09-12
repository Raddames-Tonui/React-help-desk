import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Toaster, toast } from 'react-hot-toast';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});


function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Toaster position="top-right" />
      

      <main className="flex-grow mx-auto max-w-7xl w-full p-4">
        <Outlet />
      </main>

    </div>
  );
}
