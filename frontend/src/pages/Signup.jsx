import React, { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
        setLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_URL}/user/register`, formData, {
            headers: {
                "Content-Type":"application/json"
            }
        })
        if(response.data.success) {
            navigate('/verify');
            toast.success(response.data.message)
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 px-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200/60 rounded-2xl">
        <CardHeader className="text-center pb-2">
          <Link to="/" className="inline-block mx-auto mb-2">
            <img src="/eKartImg.png" alt="eKart" className="w-20 mx-auto" />
          </Link>
          <CardTitle className="text-xl md:text-2xl font-bold">Create your account</CardTitle>
          <CardDescription className="text-sm">
            Enter your details below to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First name..."
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last name..."
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-xl"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    placeholder="Create a Password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="rounded-xl pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-100 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button
            onClick={handleSubmit}
            type="submit"
            className="w-full cursor-pointer bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl py-5 font-medium shadow-md shadow-indigo-200/50"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2"/>Please wait</> : "Sign up"}
          </Button>
          <p className="text-slate-500 text-sm">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="text-indigo-600 font-medium hover:underline cursor-pointer"
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
