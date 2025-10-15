import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import Navbar from '@/components/Navbar'
import { useAppStore } from '@/store/appStore'

export const Route = createRootRoute({
    component: RootComponent,
})

/**
 * Root Layout
 * ------------
 * - Applies theme classes to <body>
 * - Wraps all routes with Navbar and layout structure
 */

function RootComponent() {
    const theme = useAppStore((state) => state.theme);

    // Apply the theme class to <body> dynamically
    React.useEffect(() => {
        document.body.classList.remove("light", "dark");
        document.body.classList.add(theme);
    }, [theme]);
    
    return (
        <React.Fragment>
           <Navbar/>
            <Outlet />
        </React.Fragment>
    )
}
