import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import type { UserRegister } from "../shared/types/auth/UserRegister";
import { registerUser, sendOtpToEmail } from "../shared/services/auth";
import type { AxiosError } from "axios";
import CircleLoading from "../components/loaders/CircleLoading";

export default function OtpVerifier({
  length,
  registerData,
  profileImage,
}: {
  length: number;
  registerData: UserRegister;
  profileImage: File | null;
}) {
  const [otp, setOtp] = React.useState(new Array(length).fill(""));
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const ref = React.useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    ref.current[0]?.focus();
    toast.success("An OTP has been sent to your email", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    if (element.value.length > 1) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    ref.current[index + 1]?.focus();
    setOtp(newOtp);
    return true;
  };

  const handleDeleteOtp = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index !== 0) {
      ref.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");
    registerData.registrationOtp = enteredOtp;

    const formData = new FormData();
    formData.append(
      "userData",
      new Blob([JSON.stringify(registerData)], { type: "application/json" })
    );
    if (profileImage) formData.append("profileImage", profileImage);
    else formData.append("profileImage", "");

    if (enteredOtp.length !== length) {
      toast.error("Please enter complete OTP", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    try {
      setVerifyLoading(true);
      await registerUser(formData);
      toast.success("Please login to your account", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      navigate("/auth/login");
    } catch (error) {
      let errMessage = (
        (error as AxiosError).response?.data as { message?: string }
      )?.message;

      errMessage = errMessage ?? (error as AxiosError).message;
      errMessage = errMessage ?? "Something went wrong!";
      toast.error(errMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtp(new Array(length).fill(""));
    ref.current[0]?.focus();

    try {
      setResendLoading(true);
      await sendOtpToEmail(registerData.email);
      toast.success("A new OTP has been sent to your email.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    } catch (error) {
      let errMessage = (
        (error as AxiosError).response?.data as { message?: string }
      )?.message;

      errMessage = errMessage ?? (error as AxiosError).message;
      errMessage = errMessage ?? "Something went wrong!";
      toast.error(errMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col backdrop-blur-lg border justify-between border-white/20 shadow-lg rounded gap-2 mt-20 transition-all duration-300 p-10`}
      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
    >
      <h1 className="text-3xl font-medium text-white text-center tracking-tight mb-2">
        Enter your OTP
      </h1>
      <div className="otp flex justify-center gap-3 mb-2">
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target, index)}
            className="w-14 h-14 font-semibold border-2 border-blue-300 rounded-lg text-center mx-1 outline-none focus:ring-2 focus:ring-blue-400 text-[1.7rem] shadow-sm transition-all duration-150"
            onKeyDown={(e) => handleDeleteOtp(e, index)}
            ref={(el) => {
              ref.current[index] = el;
            }}
            maxLength={1}
            autoComplete="off"
          />
        ))}
      </div>
      <div className="flex justify-between w-full mt-4 gap-4">
        <button
          className="rounded-lg px-5 py-2 cursor-pointer bg-[#ffa2002b] hover:bg-[#ffa20041] transition-colors text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleResendOtp}
          disabled={resendLoading || verifyLoading}
        >
          {resendLoading ? (
            <>
              Resending <CircleLoading width="16" height="16" />
            </>
          ) : (
            "Resend OTP"
          )}
        </button>
        <button
          className="rounded-lg px-5 py-2 cursor-pointer bg-[#00ff112b] hover:bg-[#00ff1145] transition-colors text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-amber-400 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleVerifyOtp}
          disabled={resendLoading || verifyLoading}
        >
          {verifyLoading ? (
            <>
              Verifying <CircleLoading width="16" height="16" />
            </>
          ) : (
            "Verify OTP"
          )}
        </button>
      </div>
    </div>
  );
}
