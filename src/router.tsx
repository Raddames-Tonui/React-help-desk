import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// auth utilities
const auth = {
  login: (data: any) => {
    const { password, ...safeData } = data;
    sessionStorage.setItem('user', JSON.stringify(safeData));
  },
  logout: () => {
    sessionStorage.removeItem('user');
  },
  getUser: () => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

//  router with context
export const router = createRouter({
  routeTree,
  context: {
    auth,
  },
})

// Register router types globally
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}


