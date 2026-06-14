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

import {
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

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
        `${import.meta.env.VITE_URL}/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verify");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
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
          max-w-lg
          rounded-3xl
          border
          border-white/40
          bg-white/80
          backdrop-blur-xl
          shadow-2xl
          shadow-slate-200/50
        "
      >
        <CardHeader className="space-y-5 text-center pb-2">

          <Link to="/" className="mx-auto">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-indigo-100 to-violet-100 shadow-md">
              <img
                src="/eKartImg.png"
                alt="eKart"
                className="w-16 object-contain"
              />
            </div>
          </Link>

          <div>
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-800">
              Create Account
            </CardTitle>

            <CardDescription className="mt-2 text-slate-500">
              Join eKart and start your shopping journey
            </CardDescription>
          </div>

          <div className="h-px w-full bg-slate-200"></div>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">

              {/* Name Fields */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name
                  </Label>

                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="
                      h-12
                      rounded-xl
                      border-slate-200
                      focus-visible:ring-2
                      focus-visible:ring-indigo-500
                    "
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name
                  </Label>

                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="
                      h-12
                      rounded-xl
                      border-slate-200
                      focus-visible:ring-2
                      focus-visible:ring-indigo-500
                    "
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address
                </Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="
                    h-12
                    rounded-xl
                    border-slate-200
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500
                  "
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password
                </Label>

                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create a strong password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="
                      h-12
                      rounded-xl
                      border-slate-200
                      pr-12
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

                <p className="text-xs text-slate-500">
                  Use at least 8 characters for a secure password.
                </p>
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
                active:scale-[0.98]
              "
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">

          <div className="flex items-center gap-3 w-full">
            <span className="text-xs text-slate-400">
              OR
            </span>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>

          <p className="text-sm text-slate-500">
            Already have an account?

            <Link
              to="/login"
              className="
                ml-1
                font-semibold
                text-indigo-600
                hover:text-indigo-700
                hover:underline
              "
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;