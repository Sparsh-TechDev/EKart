import { ShoppingCart, Menu, Heart, X } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { setWishlist } from "@/redux/productSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const { cart, wishlist } = useSelector((store) => store.product);
  const accessToken = localStorage.getItem("accessToken");
  const admin = user?.role === "admin" ? true : false;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Track scroll for subtle navbar shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen, handleKeyDown]);

  const logoutHandler = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.data.success) {
        dispatch(setUser(null));
        localStorage.removeItem("accessToken");
        toast.success(response.data.message);
      }
    } catch (error) {}
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    ...(user
      ? [{ to: `/profile/${user._id}`, label: `Hello, ${user.firstName}` }]
      : []),
    ...(admin ? [{ to: "/Dashboard/sales", label: "Dashboard" }] : []),
  ];

  const cartCount = cart?.items?.length || 0;

  const wishlistCount = wishlist?.length || 0;

  const fetchWishlist = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) return;

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/wishlist/my-wishlist`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        dispatch(setWishlist(res.data.wishlist?.products || []));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60"
            : "bg-white/60 backdrop-blur-lg border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" aria-label="eKart Home">
            <img
              src="/eKartImg.png"
              alt="eKart"
              className="w-20 md:w-24 lg:w-28 transition-transform duration-200 hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-6 lg:gap-8"
            aria-label="Main navigation"
          >
            <ul className="flex items-center gap-5 lg:gap-7">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`relative text-sm lg:text-base font-medium transition-colors duration-200 hover:text-indigo-600 ${
                      location.pathname === link.to
                        ? "text-indigo-600"
                        : "text-slate-700"
                    }`}
                  >
                    {link.label}
                    {location.pathname === link.to && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              to="/wishlist"
              className="
    relative
    p-2
    rounded-xl
    hover:bg-slate-100
    transition-colors
  "
            >
              <Heart className="w-5 h-5 text-slate-700" />

              {wishlistCount > 0 && (
                <span
                  className="
        absolute
        -top-0.5
        -right-0.5
        bg-pink-600
        text-white
        text-[10px]
        font-bold
        rounded-full
        min-w-[18px]
        h-[18px]
        flex
        items-center
        justify-center
        px-1
      "
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingCart className="w-5 h-5 text-slate-700" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Button */}
            {user ? (
              <Button
                onClick={logoutHandler}
                variant="outline"
                className="rounded-full px-5 text-sm font-medium border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="rounded-full px-5 text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-200/50 cursor-pointer"
              >
                Login
              </Button>
            )}
          </nav>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/wishlist"
              className="
    relative
    p-2
    rounded-xl
    hover:bg-slate-100
    transition-colors
  "
            >
              <Heart className="w-5 h-5 text-slate-700" />

              {wishlistCount > 0 && (
                <span
                  className="
        absolute
        -top-0.5
        -right-0.5
        bg-pink-600
        text-white
        text-[10px]
        font-bold
        rounded-full
        min-w-[18px]
        h-[18px]
        flex
        items-center
        justify-center
        px-1
      "
                >
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingCart className="w-5 h-5 text-slate-700" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-6 h-6 text-slate-700" />
              ) : (
                <Menu className="w-6 h-6 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <img src="/eKartImg.png" alt="eKart" className="w-20" />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-1" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200 ${
                location.pathname === link.to
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="my-3 border-t border-slate-100" />

          {user ? (
            <Button
              onClick={() => {
                logoutHandler();
                setMobileOpen(false);
              }}
              variant="outline"
              className="w-full rounded-xl text-sm font-medium cursor-pointer"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => {
                navigate("/login");
                setMobileOpen(false);
              }}
              className="w-full rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white cursor-pointer"
            >
              Login
            </Button>
          )}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
