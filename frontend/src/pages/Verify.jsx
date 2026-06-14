import React from 'react'
import { Mail } from 'lucide-react'

const Verify = () => {
  return (
    <div className='relative w-full overflow-hidden'>
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 px-4'>
            <div className='bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-200/60 max-w-md w-full text-center'>
                <div className='mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-5'>
                  <Mail className='w-8 h-8 text-emerald-600' />
                </div>
                <h2 className='text-xl md:text-2xl font-bold text-slate-900 mb-3'>Check Your Email</h2>
                <p className='text-slate-500 text-sm leading-relaxed'>
                    We've sent you an email to verify your account. Please check your inbox and click the verification link.
                </p>
            </div>
        </div>
    </div>
  )
}

export default Verify