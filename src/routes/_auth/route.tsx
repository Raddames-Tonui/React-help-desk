import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Toaster, toast } from 'react-hot-toast';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});


function AuthLayout() {
  return (
    <div className="">
      <Toaster position="top-right" />
      

      <main className="">
        <Outlet />
      </main>

    </div>
  );
}
