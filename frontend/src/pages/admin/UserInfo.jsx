import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Camera,
  Loader2,
  MapPin,
  User,
} from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import userLogo from "../../assets/userLogo.png";
import { toast } from "sonner";
import axios from "axios";

const UserInfo = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);
  const params = useParams();
  const userId = params.userId;
  const [updateUser, setUpdateUser] = useState(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

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
        `http://localhost:8000/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
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

  const getUserDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/user/get-user/${userId}`,
      );
      if (response.data.success) {
        setUpdateUser(response.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 pt-6 md:pt-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <Button onClick={() => navigate(-1)} variant="outline" className="rounded-xl">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-bold text-2xl md:text-3xl text-slate-900">
            Customer Profile
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {/* LEFT SIDE */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <Card className="shadow-sm border-0 overflow-hidden bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 rounded-2xl pb-8">
              <CardContent className="pt-8 md:pt-10 flex flex-col items-center">
                {/* Profile Image */}
                <div className="relative mb-5 md:mb-6">
                  <div className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden bg-white/10 backdrop-blur-sm">
                    <Zoom>
                      <img
                        src={updateUser?.profilePic || userLogo}
                        alt="profile"
                        className="w-full h-full rounded-full object-cover cursor-pointer"
                      />
                    </Zoom>
                  </div>

                  {/* Camera Button */}
                  {/* <label className="absolute bottom-1 right-1 bg-white p-2.5 md:p-3 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-all duration-200">
                    <Camera className="h-4 w-4 md:h-5 md:w-5 text-slate-700" />

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label> */}


                </div>

                {/* Name */}
                <h3 className="font-bold text-xl md:text-2xl text-white tracking-wide text-center">
                  {updateUser?.firstName} {updateUser?.lastName}
                </h3>

                {/* Email */}
                <p className="text-white/70 text-sm mt-1">{updateUser?.email}</p>

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
  View customer profile information and account details.
</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>

                    
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
  {updateUser?.firstName || "N/A"}
</div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
  {updateUser?.lastName || "N/A"}
</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNo">Phone Number</Label>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
  {updateUser?.lastName || "N/A"}
</div>
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

                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
  {updateUser?.address || "Not Provided"}
</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
  {updateUser?.city || "Not Provided"}
</div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
  {updateUser?.zipCode || "Not Provided"}
</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserInfo;
