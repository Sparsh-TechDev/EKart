import React, { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/user/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        dispatch(setUser(response.data.user));
        localStorage.setItem("accessToken", response.data.accessToken);
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 px-4">

      {/* Background Blur Effects */}
      <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-indigo-200/20 blur-3xl"></div>
      <div className="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-violet-200/20 blur-3xl"></div>

      <Card
        className="
          relative
          w-full
          max-w-md
          rounded-3xl
          border
          border-white/40
          bg-white/80
          backdrop-blur-xl
          shadow-2xl
          shadow-slate-200/50
          transition-all
          duration-300
          hover:shadow-indigo-200/40
        "
      >
        <CardHeader className="space-y-5 text-center pb-2">

          {/* Logo */}
          <Link to="/" className="mx-auto">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-indigo-100 to-violet-100 shadow-md">
              <img
                src="/eKartImg.png"
                alt="eKart"
                className="w-16 object-contain"
              />
            </div>
          </Link>

          {/* Title */}
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-800">
              Welcome Back
            </CardTitle>

            <CardDescription className="mt-2 text-slate-500">
              Sign in to continue shopping on eKart
            </CardDescription>
          </div>

          <div className="h-px w-full bg-slate-200"></div>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-slate-700 font-medium"
                >
                  Email Address
                </Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="
                    h-12
                    rounded-xl
                    border-slate-200
                    transition-all
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500
                  "
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-slate-700 font-medium"
                  >
                    Password
                  </Label>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="
                      h-12
                      rounded-xl
                      border-slate-200
                      pr-12
                      transition-all
                      focus-visible:ring-2
                      focus-visible:ring-indigo-500
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      rounded-md
                      p-1
                      transition-colors
                      hover:bg-slate-100
                    "
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="
                mt-6
                h-12
                w-full
                rounded-xl
                bg-gradient-to-r
                from-indigo-600
                to-violet-600
                text-white
                font-semibold
                shadow-lg
                shadow-indigo-200/50
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:from-indigo-700
                hover:to-violet-700
                hover:shadow-xl
                active:scale-[0.98]
              "
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t-0 pt-0">
          <div className="flex items-center gap-3 w-full">
            <div className="h-px flex-1 bg-slate-200"></div>
            <span className="text-xs text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>

          <p className="text-sm text-slate-500">
            Don't have an account?
            <Link
              to="/signup"
              className="ml-1 font-semibold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;