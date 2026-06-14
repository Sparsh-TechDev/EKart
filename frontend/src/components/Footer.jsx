import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaPinterest, FaTwitterSquare } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className='bg-slate-900 text-slate-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12'>

          {/* Brand Info */}
          <div className='sm:col-span-2 lg:col-span-1'>
            <Link to='/'>
              <img src='/eKartImg.png' alt='eKart' className='w-24 md:w-28 brightness-200'/>
            </Link>

            <p className='mt-4 text-sm leading-relaxed text-slate-400 max-w-xs'>
              Powering Your World with the Best in Electronics. Smart shopping powered by AI.
            </p>

            <div className='mt-4 space-y-1'>
              <p className='text-xs text-slate-500'>
                123 Electronics St, Style City, NY 10001
              </p>
              <p className='text-xs text-slate-500'>
                support@eKart.com · (123) 456-7890
              </p>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>
              Customer Service
            </h3>

            <ul className='mt-4 space-y-3'>
              {['Contact Us', 'Shipping & Returns', 'FAQs', 'Order Tracking', 'Size Guide'].map((item) => (
                <li key={item}>
                  <a href="#" className='text-sm text-slate-400 hover:text-white transition-colors duration-200'>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>
              Follow Us
            </h3>

            <div className='flex gap-3 mt-4'>
              {[
                { Icon: FaFacebook, label: "Facebook" },
                { Icon: FaInstagram, label: "Instagram" },
                { Icon: FaTwitterSquare, label: "Twitter" },
                { Icon: FaPinterest, label: "Pinterest" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className='p-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 transition-all duration-200 hover:scale-110'
                >
                  <Icon className='w-4 h-4' />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>
              Stay in the Loop
            </h3>

            <p className='mt-4 text-sm text-slate-400'>
              Subscribe to get special offers, free giveaways, and more.
            </p>

            <form className='mt-4 flex rounded-xl overflow-hidden border border-slate-700 focus-within:border-indigo-500 transition-colors'>
              <input
                type='email'
                placeholder='Your email'
                className='flex-1 px-3 py-2.5 bg-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none min-w-0'
                aria-label="Email for newsletter"
              />
              <button
                type='submit'
                className='bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 text-sm font-medium hover:from-indigo-700 hover:to-violet-700 transition-all flex-shrink-0'
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className='border-t border-slate-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5'>
          <p className='text-center text-xs text-slate-500'>
            &copy; {new Date().getFullYear()}{' '}
            <span className='text-indigo-400 font-medium'>eKart</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer