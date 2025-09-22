import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';

export const Route = createFileRoute('/_public')({
  component: RouteComponent,
})


function RouteComponent() {
  return (
    <div className="">
      <Toaster position="top-right" />
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}
