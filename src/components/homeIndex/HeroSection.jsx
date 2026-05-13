import React from "react";
import WashaImage from "../../assets/images/washa-landingimg.png";
import Button from "../Button.jsx";
import { Camera, Clock, Play, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {

  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full justify-center items-center bg-white px-4 py-10">
      <div className="flex p-8 w-full max-w-6xl flex-col items-center justify-center gap-10 md:flex-row">
        <div className="max-w-xl text-center">
          <h1 className="text-4xl font-bold font-mono text-[#2c4a7d]">
            See every step of your laundry journey with Washa's real-time
            tracking and updates.
          </h1>
          <p className="mt-4 text-lg font-serif text-gray-600">
            Trust through transparency. Track your items with photo verification
            at every stage, from pickup to delivery. Know exactly where your
            clothes are and how they're being cared for.
          </p>
        </div>

        <div className="flex w-full justify-center md:w-1/2">
          <img
            src={WashaImage}
            alt="Hero Image"
            className="w-full max-w-md h-auto rounded-lg shadow-lg"
          />
        </div>

      </div>
      {/* guarantee features  */}
      <div className="flex flex-wrap justify-center items-center gap-6 mt-6">
        {/* 100% guaranteed */}
        <div className="flex items-center">
          <ShieldCheck className="w-5 h-5 text-[#4a6c9e] mr-2" />
          <p className="text-sm text-[#4a6c9e]">100% item safety</p>
        </div>
        {/* Photo verification */}
        <div className="flex items-center">
          <Camera className="w-5 h-5 text-[#4a6c9e] mr-2" />
          <p className="text-sm text-[#4a6c9e]">Photo Verification</p>
        </div>
        {/* time update */}
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-[#4a6c9e] mr-2" />
          <p className="text-sm text-[#4a6c9e]">Real Time Updates</p>
        </div>
      </div>
        {/* cta button */}
      <div className="mt-8">
         <Button
          variant=""
           onClick={() => navigate('/dashboard/customer')}
            type="button"
            className="inline-flex items-center gap-2 rounded-md text-white px-5 py-3 text-sm font-semibold bg-[#35558b] shadow-sm transition hover:bg-[#f3f5f8]"
          >
            <Play className="h-4 w-4" />
           Start Laundry Order
          </Button>
      </div>
    </div>
  );
};

export default HeroSection;
