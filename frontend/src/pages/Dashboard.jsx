import Sidebar from '@/components/Sidebar'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex min-h-screen bg-slate-50/50 pt-16'>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className='flex-1 md:ml-72'>
        {/* Mobile sidebar toggle */}
        <div className='md:hidden sticky top-16 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 px-4 py-3'>
          <button
            onClick={() => setSidebarOpen(true)}
            className='flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors'
            aria-label="Open sidebar"
          >
            <Menu className='w-5 h-5' />
            Dashboard Menu
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard