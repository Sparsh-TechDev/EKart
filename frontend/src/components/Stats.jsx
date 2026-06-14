import React from "react";

const Stats = () => {
  const stats = [
    { number: "10K+", title: "Products" },
    { number: "5K+", title: "Customers" },
    { number: "99%", title: "Satisfaction" },
    { number: "24/7", title: "Support" },
  ];

  return (
    <section className="py-14 md:py-20 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 text-center">
          {stats.map((item, index) => (
            <div key={item.title} className="relative">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                {item.number}
              </h3>
              <p className="mt-2 md:mt-3 text-sm md:text-base text-slate-400 font-medium">
                {item.title}
              </p>
              {/* Vertical divider on desktop (except last) */}
              {index < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-slate-700/50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;