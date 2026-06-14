import React, { useState } from "react";
import {
  Camera,
  Loader2,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";

import userLogo from "../assets/userLogo.png";

import { toast } from "sonner";
import axios from "axios";

const Profile = () => {
  const { user } = useSelector((store) => store.user);
  
  const params = useParams();
  const userId = params.userId;
  const navigate = useNavigate(); // Added for routing
  const dispatch = useDispatch();

  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
    profilePic: user?.profilePic || "",
    role: user?.role || "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUpdateUser({
      ...updateUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setUpdateUser({
        ...updateUser,
        profilePic: URL.createObjectURL(selectedFile),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("role", updateUser.role);

      if (file) {
        formData.append("file", file);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_URL}/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.user));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 md:pt-24 pb-20 min-h-screen bg-slate-50/50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Account Settings
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Manage your profile details and account preferences.
            </p>
          </div>

          {/* My Orders button */}
          <Button
            type="button"
            onClick={() => navigate("/orders")}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl shadow-md shadow-indigo-200/50"
          >
            My Orders
          </Button>
        </div>

        {/* Profile Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {/* LEFT SIDE */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <Card className="shadow-sm border-0 overflow-hidden bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 rounded-2xl pb-8">
              <CardContent className="pt-8 md:pt-10 flex flex-col items-center">
                {/* Profile Image */}
                <div className="relative mb-5 md:mb-6 group/avatar">
                  {/* Outer glow ring */}
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-white/30 via-white/10 to-white/30 blur-sm" />

                  {/* White padding ring — creates the premium gap between image and edge */}
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full p-[5px] sm:p-1.5 md:p-2 bg-white/20 backdrop-blur-md shadow-2xl ring-1 ring-white/30">

                    {/* Image container — forces perfect circle & covers any aspect ratio */}
                    <div className="w-full h-full rounded-full overflow-hidden bg-white/10">
                      <Zoom>
                        <img
                          src={updateUser?.profilePic || userLogo}
                          alt={`${updateUser.firstName} ${updateUser.lastName}`}
                          className="block w-full h-full rounded-full object-cover object-center aspect-square cursor-pointer select-none"
                          draggable={false}
                        />
                      </Zoom>
                    </div>
                  </div>

                  {/* Camera upload button — attached to bottom-right edge */}
                  <label
                    className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 md:bottom-2 md:right-2
                      flex items-center justify-center
                      w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11
                      rounded-full bg-white shadow-lg shadow-black/10
                      ring-2 ring-white
                      cursor-pointer
                      hover:scale-110 hover:shadow-xl hover:shadow-indigo-200/40
                      active:scale-95
                      transition-all duration-200 ease-out
                      group-hover/avatar:ring-indigo-200"
                    title="Change profile photo"
                  >
                    <Camera className="h-4 w-4 md:h-[18px] md:w-[18px] text-slate-600 group-hover/avatar:text-indigo-600 transition-colors" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {/* Name */}
                <h3 className="font-bold text-xl md:text-2xl text-white tracking-wide text-center">
                  {updateUser.firstName} {updateUser.lastName}
                </h3>

                {/* Role */}
                <div className="flex items-center gap-1.5 text-white/90 mt-3 font-medium bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm text-sm">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="capitalize">
                    {updateUser.role || "User"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Personal Information */}
            <Card className="shadow-sm border-slate-200/60 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <User className="h-5 w-5 text-indigo-500" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Update your basic profile details here.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={updateUser.firstName}
                      onChange={handleChange}
                      className="bg-white rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={updateUser.lastName}
                      onChange={handleChange}
                      className="bg-white rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={updateUser.email}
                      className="bg-slate-50 text-slate-500 cursor-not-allowed rounded-xl"
                      disabled
                    />
                    <p className="text-[11px] text-slate-400">
                      Email cannot be changed.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNo">Phone Number</Label>
                    <Input
                      id="phoneNo"
                      type="text"
                      name="phoneNo"
                      value={updateUser.phoneNo}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="bg-white rounded-xl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="shadow-sm border-slate-200/60 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <MapPin className="h-5 w-5 text-violet-500" />
                  Location Details
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    type="text"
                    name="address"
                    value={updateUser.address}
                    onChange={handleChange}
                    placeholder="123 Main St, Apt 4B"
                    className="bg-white rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      type="text"
                      name="city"
                      placeholder="New York"
                      value={updateUser.city}
                      onChange={handleChange}
                      className="bg-white rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      name="zipCode"
                      placeholder="10001"
                      value={updateUser.zipCode}
                      onChange={handleChange}
                      className="bg-white rounded-xl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-8 shadow-md shadow-indigo-200/50 rounded-xl transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving changes...
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;