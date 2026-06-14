import { LayoutDashboard, PackagePlus, PackageSearch, Users, X } from 'lucide-react'
import React from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard/sales', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/add-product', icon: PackagePlus, label: 'Add Product' },
  { to: '/dashboard/products', icon: PackageSearch, label: 'Products' },
  { to: '/dashboard/users', icon: Users, label: 'Users' },
  { to: '/dashboard/orders', icon: FaRegEdit, label: 'Orders' },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-50 md:z-10 h-screen w-72 bg-white border-r border-slate-200/60 transform transition-transform duration-300 ease-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 md:hidden">
          <span className="font-semibold text-slate-800">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className='pt-20 md:pt-24 px-4 space-y-1'>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 text-sm font-medium cursor-pointer px-4 py-3 rounded-xl w-full transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200/50'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="whitespace-nowrap">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  )
}

export default Sidebar