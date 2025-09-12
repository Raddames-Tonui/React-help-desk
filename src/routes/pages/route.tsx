import { createFileRoute, Outlet } from '@tanstack/react-router'
import Navbar from '@components/Navbar'
import Sidebar from '@components/Sidebar'
import Footer from '@components/Footer'

import "@css/layout.css"


export const Route = createFileRoute('/pages')({
  component: PageLayout,
})

function PageLayout() {
  return (
    <div className="body-wrapper">
      <Navbar />
      <Sidebar/>


      <main>
        <Outlet />
      </main>
      <Footer/>
    </div>
  )
}
