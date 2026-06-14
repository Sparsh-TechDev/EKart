import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Wallet,
} from "lucide-react";

const statCards = [
  {
    key: "totalUsers",
    label: "Total Users",
    icon: Users,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    key: "totalProducts",
    label: "Total Products",
    icon: Package,
    gradient: "from-violet-500 to-purple-500",
  },
  {
    key: "totalOrders",
    label: "Total Orders",
    icon: ShoppingCart,
    gradient: "from-amber-500 to-orange-500",
  },
  {
    key: "totalSales",
    label: "Total Sales",
    icon: DollarSign,
    gradient: "from-emerald-500 to-green-500",
  },
];

const AdminSales = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    averageOrderValue: 0,
    forecastRevenue: 0,
    sales: [],
    topProducts: [],
    topCategories: [],
    insights: [],
    demandForecast: [],
  });

  const accessToken = localStorage.getItem("accessToken");

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/orders/sales`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 pt-6 md:pt-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
        Sales Analytics Dashboard
      </h1>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Existing Stats */}
        {statCards.map(({ key, label, icon: Icon, gradient }) => (
          <Card
            key={key}
            className={`bg-gradient-to-br ${gradient} text-white shadow-lg border-0 rounded-2xl overflow-hidden`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-white/80">
                  {label}
                </CardTitle>

                <Icon className="w-5 h-5 text-white/60" />
              </div>
            </CardHeader>

            <CardContent className="text-2xl md:text-3xl font-bold">
              {key === "totalSales"
                ? `₹${Number(stats[key]).toLocaleString("en-IN")}`
                : stats[key]}
            </CardContent>
          </Card>
        ))}

        {/* Revenue Forecast */}
        <Card className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg border-0 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-white/80">
                Predicted Revenue
              </CardTitle>

              <TrendingUp className="w-5 h-5 text-white/60" />
            </div>
          </CardHeader>

          <CardContent className="text-2xl md:text-3xl font-bold">
            ₹{Math.round(stats.forecastRevenue || 0).toLocaleString("en-IN")}
          </CardContent>
        </Card>

        {/* Average Order Value */}
        <Card className="bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg border-0 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-white/80">
                Avg Order Value
              </CardTitle>

              <Wallet className="w-5 h-5 text-white/60" />
            </div>
          </CardHeader>

          <CardContent className="text-2xl md:text-3xl font-bold">
            ₹{Math.round(stats.averageOrderValue || 0).toLocaleString("en-IN")}
          </CardContent>
        </Card>

        {/* Sales Chart */}
        <Card className="sm:col-span-2 lg:col-span-4 rounded-2xl shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">
              Sales Trend Analysis (Last 30 Days)
            </CardTitle>
          </CardHeader>

          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.sales}>
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop
                      offset="100%"
                      stopColor="#6366f1"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>

                <XAxis dataKey="date" tick={{ fontSize: 12 }} />

                <YAxis tick={{ fontSize: 12 }} />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#6366f1"
                  fill="url(#colorGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              Top Selling Products
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {stats.topProducts?.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>

                    <p className="text-sm font-medium text-slate-700 truncate">
                      {product.name}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold whitespace-nowrap">
                    {product.sold} sold
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              Top Categories
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {stats.topCategories?.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>

                    <span className="font-medium text-slate-700">
                      {category.category}
                    </span>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                    {category.sold} sold
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 rounded-2xl border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              Business Insights
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3">
              {stats.insights?.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />

                  <p className="text-sm text-slate-700 leading-relaxed">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 rounded-2xl border-slate-100 shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              Demand Forecast Analytics
            </CardTitle>

            <p className="text-sm text-slate-500">
              Predicted product demand based on purchases, cart activity and
              wishlist trends.
            </p>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4">
              {stats.demandForecast?.map((item, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-white border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Ranking */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        index === 0
                          ? "bg-red-100 text-red-600"
                          : index === 1
                            ? "bg-amber-100 text-amber-600"
                            : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      #{index + 1}
                    </div>

                    {/* Product Info */}
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">
  {item.productName.length > 80
    ? `${item.productName.substring(0, 80)}...`
    : item.productName}
</p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">
                          Demand Score
                        </span>

                        <span className="text-xs font-semibold text-indigo-600">
                          {item.score}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Demand Badge */}
                  <span
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap ${
                      item.level === "High"
                        ? "bg-red-100 text-red-600"
                        : item.level === "Medium"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {item.level} Demand
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSales;
