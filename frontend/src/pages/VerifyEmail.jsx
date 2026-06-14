import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/user/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        setStatus("success");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setStatus("error");
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token]);

  return (
    <div className="relative w-full bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 overflow-hidden">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-200/60 text-center w-full max-w-md">
          {status === "verifying" && (
            <>
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-5">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Verifying your email...</h2>
              <p className="text-sm text-slate-500 mt-2">Please wait a moment</p>
            </>
          )}
          {status === "success" && (
            <>
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-5">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Verification Successful</h2>
              <p className="text-sm text-slate-500 mt-2">Redirecting to login...</p>
            </>
          )}
          {status === "error" && (
            <>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-5">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Verification Failed</h2>
              <p className="text-sm text-slate-500 mt-2">Please try again or contact support</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
