import { Headphones, Shield, Truck, Zap } from 'lucide-react'
import React from 'react'

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "Free delivery on all orders above ₹499",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    desc: "100% secure transaction with SSL encryption",
    color: "from-emerald-500 to-green-500",
    bg: "bg-emerald-50",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Round the clock customer support team",
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "AI-powered search for instant results",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
  },
];

const Features = () => {
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group flex items-start gap-4 p-5 md:p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-white"
              >
                <div className={`${item.bg} p-3 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
                </div>

                <div>
                  <h3 className="font-semibold text-sm md:text-base text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}

export default Features