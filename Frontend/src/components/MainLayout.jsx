import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
const MainLayout = () => {
  return (
    <div className='flex min-h-screen bg-white dark:bg-black text-black dark:text-white'>
        <LeftSidebar />
        <main className='flex-1 p-4'>
            <Outlet/>
        </main>
    </div>
  )
}

export default MainLayout