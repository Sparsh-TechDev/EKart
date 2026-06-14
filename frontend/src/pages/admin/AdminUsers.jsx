import { Input } from "@/components/ui/input";
import axios from "axios";
import { Eye, Search, Calendar } from "lucide-react";
import React, { useEffect, useState } from "react";
import userLogo from "../../assets/userLogo.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, ShieldOff } from "lucide-react";
import { toast } from "sonner";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/user/all-user`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const updateRole = async (userId, makeAdminRole) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const response = await axios.put(
      `${import.meta.env.VITE_URL}/user/${
        makeAdminRole
          ? `make-admin/${userId}`
          : `remove-admin/${userId}`
      }`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.success) {
      toast.success(response.data.message);
      getAllUsers();
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Something went wrong"
    );
  }
};

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 pt-6 md:pt-8">
      <h1 className="font-bold text-2xl md:text-3xl text-slate-900">
        User Management
      </h1>

      <p className="text-sm text-slate-500 mt-1">
        View and manage registered users
      </p>

      {/* Search */}
      <div className="flex relative w-full max-w-sm mt-5 md:mt-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />

        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 rounded-xl bg-white border-slate-200"
          placeholder="Search Users..."
        />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-6 md:mt-7">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="p-5">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <img
                  src={user?.profilePic || userLogo}
                  alt=""
                  className="rounded-full w-14 h-14 object-cover border-2 border-indigo-100 flex-shrink-0"
                />

                <div className="min-w-0">
                  <h2 className="font-semibold text-base text-slate-800 truncate">
                    {user?.firstName} {user?.lastName}
                  </h2>

                  <p className="text-sm text-slate-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-violet-100 text-violet-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                {user.role === "admin" ? (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => updateRole(user._id, false)}
                  >
                    <ShieldOff className="w-4 h-4 mr-2" />
                    Remove Admin
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => updateRole(user._id, true)}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Make Admin
                  </Button>
                )}
              </div>

              {/* Joined Date */}
              <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                Joined {new Date(user.createdAt).toLocaleDateString("en-IN")}
              </div>

              {/* Actions */}
              <div className="mt-5">
                <Button
                  onClick={() =>
                    navigate(`/dashboard/users/orders/${user._id}`)
                  }
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Orders
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-16">
          <h3 className="font-semibold text-slate-700">No users found</h3>

          <p className="text-sm text-slate-500 mt-1">
            Try a different search term.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
